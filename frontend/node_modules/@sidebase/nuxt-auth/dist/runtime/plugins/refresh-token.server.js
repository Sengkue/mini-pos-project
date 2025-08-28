import { _fetch } from "../utils/fetch.js";
import { jsonPointerGet, objectFromJsonPointer, useTypedBackendConfig } from "../helpers.js";
import { defineNuxtPlugin, useAuthState, useRuntimeConfig } from "#imports";
export default defineNuxtPlugin({
  name: "refresh-token-plugin",
  enforce: "pre",
  async setup(nuxtApp) {
    const { rawToken, rawRefreshToken, refreshToken, token, lastRefreshedAt } = useAuthState();
    if (refreshToken.value && token.value) {
      const provider = useTypedBackendConfig(useRuntimeConfig(), "local");
      const { path, method } = provider.refresh.endpoint;
      const refreshRequestTokenPointer = provider.refresh.token.refreshRequestTokenPointer;
      const headers = new Headers({
        [provider.token.headerName]: token.value
      });
      try {
        const response = await _fetch(nuxtApp, path, {
          method,
          body: objectFromJsonPointer(refreshRequestTokenPointer, refreshToken.value),
          headers
        });
        const tokenPointer = provider.refresh.token.refreshResponseTokenPointer || provider.token.signInResponseTokenPointer;
        const extractedToken = jsonPointerGet(
          response,
          tokenPointer
        );
        if (typeof extractedToken !== "string") {
          console.error(
            `Auth: string token expected, received instead: ${JSON.stringify(
              extractedToken
            )}. Tried to find token at ${tokenPointer} in ${JSON.stringify(response)}`
          );
          return;
        }
        if (!provider.refresh.refreshOnlyToken) {
          const extractedRefreshToken = jsonPointerGet(
            response,
            provider.refresh.token.signInResponseRefreshTokenPointer
          );
          if (typeof extractedRefreshToken !== "string") {
            console.error(
              `Auth: string token expected, received instead: ${JSON.stringify(
                extractedRefreshToken
              )}. Tried to find token at ${provider.refresh.token.signInResponseRefreshTokenPointer} in ${JSON.stringify(response)}`
            );
            return;
          }
          rawRefreshToken.value = extractedRefreshToken;
        }
        rawToken.value = extractedToken;
        lastRefreshedAt.value = /* @__PURE__ */ new Date();
      } catch (err) {
        console.error(err);
        rawRefreshToken.value = null;
        rawToken.value = null;
      }
    }
  }
});
