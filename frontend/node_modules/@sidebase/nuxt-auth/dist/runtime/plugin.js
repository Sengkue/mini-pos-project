import { getHeader } from "h3";
import authMiddleware from "./middleware/sidebase-auth.js";
import { getNitroRouteRules } from "./utils/kit.js";
import { FetchConfigurationError } from "./utils/fetch.js";
import { resolveApiBaseURL } from "./utils/url.js";
import { _refreshHandler, addRouteMiddleware, defineNuxtPlugin, useAuth, useAuthState, useRuntimeConfig } from "#imports";
export default defineNuxtPlugin(async (nuxtApp) => {
  const { data, lastRefreshedAt, loading } = useAuthState();
  const { getSession } = useAuth();
  const wholeRuntimeConfig = useRuntimeConfig();
  const runtimeConfig = wholeRuntimeConfig.public.auth;
  const globalAppMiddleware = runtimeConfig.globalAppMiddleware;
  const routeRules = import.meta.server ? getNitroRouteRules(nuxtApp._route.path) : {};
  if (import.meta.server) {
    runtimeConfig.baseURL = resolveApiBaseURL(wholeRuntimeConfig);
  }
  let nitroPrerender = false;
  if (nuxtApp.ssrContext) {
    nitroPrerender = getHeader(nuxtApp.ssrContext.event, "x-nitro-prerender") !== void 0;
  }
  let disableServerSideAuth = routeRules.disableServerSideAuth;
  disableServerSideAuth ??= runtimeConfig?.disableServerSideAuth;
  disableServerSideAuth ??= false;
  if (disableServerSideAuth) {
    loading.value = true;
  }
  const isErrorUrl = nuxtApp.ssrContext?.error === true;
  const requireAuthOnErrorPage = globalAppMiddleware === true || typeof globalAppMiddleware === "object" && globalAppMiddleware.allow404WithoutAuth;
  const shouldFetchSession = typeof data.value === "undefined" && !nitroPrerender && !disableServerSideAuth && !(isErrorUrl && requireAuthOnErrorPage);
  if (shouldFetchSession) {
    try {
      await getSession();
    } catch (e) {
      if (!(e instanceof FetchConfigurationError)) {
        throw e;
      }
    }
  }
  nuxtApp.hook("app:mounted", () => {
    _refreshHandler.init();
    if (disableServerSideAuth) {
      getSession();
    }
  });
  const _unmount = nuxtApp.vueApp.unmount;
  nuxtApp.vueApp.unmount = function() {
    _refreshHandler.destroy();
    lastRefreshedAt.value = void 0;
    data.value = void 0;
    _unmount();
  };
  if (globalAppMiddleware === true || typeof globalAppMiddleware === "object" && globalAppMiddleware.isEnabled) {
    addRouteMiddleware("auth", authMiddleware, {
      global: true
    });
  }
});
