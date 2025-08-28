import { defu } from "defu";
import { readonly } from "vue";
import { appendHeader } from "h3";
import { resolveApiUrlPath } from "../../utils/url.js";
import { _fetch } from "../../utils/fetch.js";
import { isNonEmptyObject } from "../../utils/checkSessionResult.js";
import { useTypedBackendConfig } from "../../helpers.js";
import { getRequestURLWN } from "../common/getRequestURL.js";
import { determineCallbackUrl } from "../../utils/callbackUrl.js";
import { navigateToAuthPageWN } from "./utils/navigateToAuthPage.js";
import { callWithNuxt } from "#app/nuxt";
import { createError, useAuthState, useNuxtApp, useRequestHeaders, useRuntimeConfig } from "#imports";
export function useAuth() {
  const nuxt = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  const backendConfig = useTypedBackendConfig(runtimeConfig, "authjs");
  const {
    data,
    loading,
    status,
    lastRefreshedAt
  } = useAuthState();
  async function signIn(provider, options, authorizationParams) {
    const configuredProviders = await getProviders();
    if (!configuredProviders) {
      const errorUrl = resolveApiUrlPath("error", runtimeConfig);
      await navigateToAuthPageWN(nuxt, errorUrl, true);
      return {
        // Future AuthJS compat here and in other places
        // https://authjs.dev/reference/core/errors#invalidprovider
        error: "InvalidProvider",
        ok: false,
        status: 500,
        url: errorUrl
      };
    }
    if (typeof provider === "undefined") {
      provider = backendConfig.defaultProvider;
    }
    const { redirect = true } = options ?? {};
    const callbackUrl = await callWithNuxt(nuxt, () => determineCallbackUrl(runtimeConfig.public.auth, options?.callbackUrl));
    const signinUrl = resolveApiUrlPath("signin", runtimeConfig);
    const queryParams = callbackUrl ? `?${new URLSearchParams({ callbackUrl })}` : "";
    const hrefSignInAllProviderPage = `${signinUrl}${queryParams}`;
    const selectedProvider = provider && configuredProviders[provider];
    if (!selectedProvider) {
      await navigateToAuthPageWN(nuxt, hrefSignInAllProviderPage, true);
      return {
        // https://authjs.dev/reference/core/errors#invalidprovider
        error: "InvalidProvider",
        ok: false,
        status: 400,
        url: hrefSignInAllProviderPage
      };
    }
    const isCredentials = selectedProvider.type === "credentials";
    const isEmail = selectedProvider.type === "email";
    const isSupportingReturn = isCredentials || isEmail;
    const action = isCredentials ? "callback" : "signin";
    const csrfToken = await getCsrfTokenWithNuxt(nuxt);
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      ...await getRequestHeaders(nuxt)
    };
    const body = new URLSearchParams({
      ...options,
      csrfToken,
      callbackUrl,
      json: true
    });
    const fetchSignIn = () => _fetch(nuxt, `/${action}/${provider}`, {
      method: "post",
      params: authorizationParams,
      headers,
      body
    }).catch((error2) => error2.data);
    const data2 = await callWithNuxt(nuxt, fetchSignIn);
    if (redirect || !isSupportingReturn) {
      const href = data2.url ?? callbackUrl;
      await navigateToAuthPageWN(nuxt, href);
      const error2 = new URL(href, "http://_").searchParams.get("error");
      return {
        error: error2,
        ok: true,
        status: 302,
        url: href
      };
    }
    const error = new URL(data2.url).searchParams.get("error");
    await getSessionWithNuxt(nuxt);
    return {
      error,
      status: 200,
      ok: true,
      url: error ? null : data2.url
    };
  }
  async function getProviders() {
    const headers = await getRequestHeaders(nuxt, false);
    return _fetch(
      nuxt,
      "/providers",
      { headers }
    );
  }
  async function getSession(getSessionOptions) {
    const callbackUrlFallback = await getRequestURLWN(nuxt);
    const { required, callbackUrl, onUnauthenticated } = defu(getSessionOptions || {}, {
      required: false,
      callbackUrl: void 0,
      onUnauthenticated: () => signIn(void 0, {
        callbackUrl: getSessionOptions?.callbackUrl || callbackUrlFallback
      })
    });
    function onError() {
      loading.value = false;
    }
    const headers = await getRequestHeaders(nuxt);
    return _fetch(nuxt, "/session", {
      onResponse: ({ response }) => {
        const sessionData = response._data;
        if (import.meta.server) {
          const setCookieValues = response.headers.getSetCookie ? response.headers.getSetCookie() : [response.headers.get("set-cookie")];
          if (setCookieValues && nuxt.ssrContext) {
            for (const value of setCookieValues) {
              if (!value) {
                continue;
              }
              appendHeader(nuxt.ssrContext.event, "set-cookie", value);
            }
          }
        }
        data.value = isNonEmptyObject(sessionData) ? sessionData : null;
        loading.value = false;
        if (required && status.value === "unauthenticated") {
          return onUnauthenticated();
        }
        return sessionData;
      },
      onRequest: ({ options }) => {
        lastRefreshedAt.value = /* @__PURE__ */ new Date();
        options.params = {
          ...options.params,
          callbackUrl: callbackUrl || callbackUrlFallback
        };
      },
      onRequestError: onError,
      onResponseError: onError,
      headers
    });
  }
  function getSessionWithNuxt(nuxt2) {
    return callWithNuxt(nuxt2, getSession);
  }
  async function signOut(options) {
    const { callbackUrl: userCallbackUrl, redirect = true } = options ?? {};
    const csrfToken = await getCsrfTokenWithNuxt(nuxt);
    const callbackUrl = await determineCallbackUrl(
      runtimeConfig.public.auth,
      userCallbackUrl,
      true
    );
    if (!csrfToken) {
      throw createError({ statusCode: 400, message: "Could not fetch CSRF Token for signing out" });
    }
    const signoutData = await _fetch(nuxt, "/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...await getRequestHeaders(nuxt)
      },
      onRequest: ({ options: options2 }) => {
        options2.body = new URLSearchParams({
          csrfToken,
          callbackUrl,
          json: "true"
        });
      }
    }).catch((error) => error.data);
    if (redirect) {
      const url = signoutData.url ?? callbackUrl;
      return navigateToAuthPageWN(nuxt, url);
    }
    await getSessionWithNuxt(nuxt);
    return signoutData;
  }
  async function getRequestHeaders(nuxt2, includeCookie = true) {
    const headers = await callWithNuxt(nuxt2, () => useRequestHeaders(["cookie", "host"]));
    if (includeCookie && headers.cookie) {
      return headers;
    }
    return { host: headers.host };
  }
  async function getCsrfToken() {
    const headers = await getRequestHeaders(nuxt);
    return _fetch(nuxt, "/csrf", { headers }).then((response) => response.csrfToken);
  }
  function getCsrfTokenWithNuxt(nuxt2) {
    return callWithNuxt(nuxt2, getCsrfToken);
  }
  return {
    status,
    data: readonly(data),
    lastRefreshedAt: readonly(lastRefreshedAt),
    getSession,
    getCsrfToken,
    getProviders,
    signIn,
    signOut,
    refresh: getSession
  };
}
export default useAuth;
