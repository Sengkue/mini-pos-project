import { readonly } from "vue";
import { jsonPointerGet, objectFromJsonPointer, useTypedBackendConfig } from "../../helpers.js";
import { _fetch } from "../../utils/fetch.js";
import { getRequestURLWN } from "../common/getRequestURL.js";
import { ERROR_PREFIX } from "../../utils/logger.js";
import { determineCallbackUrl } from "../../utils/callbackUrl.js";
import { formatToken } from "./utils/token.js";
import { useAuthState } from "./useAuthState.js";
import { navigateTo, nextTick, useNuxtApp, useRoute, useRuntimeConfig } from "#imports";
export function useAuth() {
  const nuxt = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  const config = useTypedBackendConfig(runtimeConfig, "local");
  const {
    data,
    status,
    lastRefreshedAt,
    loading,
    token,
    refreshToken,
    rawToken,
    rawRefreshToken,
    _internal
  } = useAuthState();
  async function signIn(credentials, signInOptions, signInParams, signInHeaders) {
    const { path, method } = config.endpoints.signIn;
    const response = await _fetch(nuxt, path, {
      method,
      body: credentials,
      params: signInParams ?? {},
      headers: signInHeaders ?? {}
    });
    if (typeof response !== "object" || response === null) {
      console.error(`${ERROR_PREFIX} signIn returned non-object value`);
      return;
    }
    const extractedToken = jsonPointerGet(response, config.token.signInResponseTokenPointer);
    if (typeof extractedToken !== "string") {
      console.error(
        `${ERROR_PREFIX} string token expected, received instead: ${JSON.stringify(extractedToken)}. Tried to find token at ${config.token.signInResponseTokenPointer} in ${JSON.stringify(response)}`
      );
      return;
    }
    rawToken.value = extractedToken;
    if (config.refresh.isEnabled) {
      const refreshTokenPointer = config.refresh.token.signInResponseRefreshTokenPointer;
      const extractedRefreshToken = jsonPointerGet(response, refreshTokenPointer);
      if (typeof extractedRefreshToken !== "string") {
        console.error(
          `${ERROR_PREFIX} string token expected, received instead: ${JSON.stringify(extractedRefreshToken)}. Tried to find refresh token at ${refreshTokenPointer} in ${JSON.stringify(response)}`
        );
        return;
      }
      rawRefreshToken.value = extractedRefreshToken;
    }
    const { redirect = true, external, callGetSession = true } = signInOptions ?? {};
    if (callGetSession) {
      await nextTick(getSession);
    }
    if (redirect) {
      let callbackUrl = signInOptions?.callbackUrl;
      if (typeof callbackUrl === "undefined") {
        const redirectQueryParam = useRoute()?.query?.redirect;
        callbackUrl = await determineCallbackUrl(runtimeConfig.public.auth, redirectQueryParam?.toString());
      }
      await navigateTo(callbackUrl, { external });
      return;
    }
    return response;
  }
  async function signOut(signOutOptions) {
    const signOutConfig = config.endpoints.signOut;
    let headers;
    let body;
    if (signOutConfig) {
      headers = new Headers({ [config.token.headerName]: token.value });
      if (config.refresh.isEnabled && ["post", "put", "patch", "delete"].includes(signOutConfig.method.toLowerCase())) {
        const signoutRequestRefreshTokenPointer = config.refresh.token.refreshRequestTokenPointer;
        body = objectFromJsonPointer(signoutRequestRefreshTokenPointer, refreshToken.value);
      }
    }
    data.value = null;
    rawToken.value = null;
    rawRefreshToken.value = null;
    let res;
    if (signOutConfig) {
      const { path, method } = signOutConfig;
      res = await _fetch(nuxt, path, { method, headers, body });
    }
    const { redirect = true, external } = signOutOptions ?? {};
    if (redirect) {
      let callbackUrl = signOutOptions?.callbackUrl;
      if (typeof callbackUrl === "undefined") {
        const redirectQueryParam = useRoute()?.query?.redirect;
        callbackUrl = await determineCallbackUrl(runtimeConfig.public.auth, redirectQueryParam?.toString(), true);
      }
      await navigateTo(callbackUrl, { external });
    }
    return res;
  }
  async function getSession(getSessionOptions) {
    const { path, method } = config.endpoints.getSession;
    let tokenValue = token.value;
    tokenValue ??= formatToken(_internal.rawTokenCookie.value, config);
    if (!tokenValue && !getSessionOptions?.force) {
      loading.value = false;
      return;
    }
    const headers = new Headers();
    if (tokenValue) {
      headers.append(config.token.headerName, tokenValue);
    }
    loading.value = true;
    try {
      const result = await _fetch(nuxt, path, { method, headers }, true);
      const { dataResponsePointer: sessionDataResponsePointer } = config.session;
      data.value = jsonPointerGet(result, sessionDataResponsePointer);
    } catch (err) {
      if (!data.value && err instanceof Error) {
        console.error(`Session: unable to extract session, ${err.message}`);
      }
      data.value = null;
      rawToken.value = null;
    }
    loading.value = false;
    lastRefreshedAt.value = /* @__PURE__ */ new Date();
    const { required = false, callbackUrl, onUnauthenticated, external } = getSessionOptions ?? {};
    if (required && data.value === null) {
      if (onUnauthenticated) {
        return onUnauthenticated();
      }
      await navigateTo(callbackUrl ?? await getRequestURLWN(nuxt), { external });
    }
    return data.value;
  }
  async function signUp(credentials, signUpOptions) {
    const signUpEndpoint = config.endpoints.signUp;
    if (!signUpEndpoint) {
      console.warn(`${ERROR_PREFIX} provider.endpoints.signUp is disabled.`);
      return;
    }
    const { path, method } = signUpEndpoint;
    const result = await _fetch(nuxt, path, {
      method,
      body: credentials
    });
    if (signUpOptions?.preventLoginFlow) {
      return result;
    }
    return signIn(credentials, signUpOptions);
  }
  async function refresh(getSessionOptions) {
    if (!config.refresh.isEnabled) {
      return getSession(getSessionOptions);
    }
    const { path, method } = config.refresh.endpoint;
    const refreshRequestTokenPointer = config.refresh.token.refreshRequestTokenPointer;
    const headers = new Headers({
      [config.token.headerName]: token.value
    });
    const response = await _fetch(nuxt, path, {
      method,
      headers,
      body: objectFromJsonPointer(refreshRequestTokenPointer, refreshToken.value)
    });
    const tokenPointer = config.refresh.token.refreshResponseTokenPointer || config.token.signInResponseTokenPointer;
    const extractedToken = jsonPointerGet(response, tokenPointer);
    if (typeof extractedToken !== "string") {
      console.error(
        `Auth: string token expected, received instead: ${JSON.stringify(extractedToken)}. Tried to find token at ${tokenPointer} in ${JSON.stringify(response)}`
      );
      return;
    }
    if (!config.refresh.refreshOnlyToken) {
      const refreshTokenPointer = config.refresh.token.signInResponseRefreshTokenPointer;
      const extractedRefreshToken = jsonPointerGet(response, refreshTokenPointer);
      if (typeof extractedRefreshToken !== "string") {
        console.error(
          `Auth: string token expected, received instead: ${JSON.stringify(extractedRefreshToken)}. Tried to find refresh token at ${refreshTokenPointer} in ${JSON.stringify(response)}`
        );
        return;
      }
      rawRefreshToken.value = extractedRefreshToken;
    }
    rawToken.value = extractedToken;
    lastRefreshedAt.value = /* @__PURE__ */ new Date();
    await nextTick();
    return getSession(getSessionOptions);
  }
  return {
    status,
    data: readonly(data),
    lastRefreshedAt: readonly(lastRefreshedAt),
    token: readonly(token),
    refreshToken: readonly(refreshToken),
    getSession,
    signIn,
    signOut,
    signUp,
    refresh
  };
}
