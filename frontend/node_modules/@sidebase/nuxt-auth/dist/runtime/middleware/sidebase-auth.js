import { isExternalUrl } from "../utils/url.js";
import { isProduction } from "../helpers.js";
import { ERROR_PREFIX } from "../utils/logger.js";
import { determineCallbackUrlForRouteMiddleware } from "../utils/callbackUrl.js";
import { defineNuxtRouteMiddleware, navigateTo, useAuth, useRuntimeConfig } from "#imports";
export default defineNuxtRouteMiddleware((to) => {
  const options = normalizeUserOptions(to.meta.auth);
  if (!options) {
    return;
  }
  const authConfig = useRuntimeConfig().public.auth;
  const { status, signIn } = useAuth();
  const isGuestMode = options.unauthenticatedOnly;
  const isAuthenticated = status.value === "authenticated";
  if (isGuestMode && status.value === "unauthenticated") {
    return;
  } else if (isGuestMode && isAuthenticated) {
    return navigateTo(options.navigateAuthenticatedTo);
  } else if (isAuthenticated) {
    return;
  }
  if (authConfig.provider.type === "local") {
    const loginRoute = authConfig.provider.pages.login;
    if (loginRoute && loginRoute === to.path) {
      return;
    }
  }
  const globalAppMiddleware = authConfig.globalAppMiddleware;
  if (globalAppMiddleware === true || typeof globalAppMiddleware === "object" && globalAppMiddleware.allow404WithoutAuth) {
    const matchedRoute = to.matched.length > 0;
    if (!matchedRoute) {
      return;
    }
  }
  if (authConfig.provider.type === "authjs") {
    const callbackUrl = determineCallbackUrlForRouteMiddleware(authConfig, to);
    const signInOptions = {
      error: "SessionRequired",
      callbackUrl
    };
    return signIn(void 0, signInOptions);
  }
  if (options.navigateUnauthenticatedTo) {
    return navigateTo(options.navigateUnauthenticatedTo);
  }
  const loginPage = authConfig.provider.pages.login;
  if (typeof loginPage !== "string") {
    console.warn(`${ERROR_PREFIX} provider.pages.login is misconfigured`);
    return;
  }
  const external = isExternalUrl(loginPage);
  if (typeof globalAppMiddleware === "object" && globalAppMiddleware.addDefaultCallbackUrl) {
    let redirectUrl = to.fullPath;
    if (typeof globalAppMiddleware.addDefaultCallbackUrl === "string") {
      redirectUrl = globalAppMiddleware.addDefaultCallbackUrl;
    }
    return navigateTo({
      path: loginPage,
      query: {
        redirect: redirectUrl
      }
    }, { external });
  }
  return navigateTo(loginPage, { external });
});
function normalizeUserOptions(userOptions) {
  if (typeof userOptions === "boolean" || userOptions === void 0) {
    return userOptions !== false ? {
      // Guest Mode off if `auth: true`
      unauthenticatedOnly: false,
      navigateAuthenticatedTo: "/",
      navigateUnauthenticatedTo: void 0
    } : void 0;
  }
  if (typeof userOptions === "object") {
    if (userOptions.unauthenticatedOnly === void 0) {
      if (!isProduction) {
        console.warn(
          `${ERROR_PREFIX} \`unauthenticatedOnly\` was not provided to \`definePageMeta\` - defaulting to Guest Mode enabled. Read more at https://auth.sidebase.io/guide/application-side/protecting-pages#middleware-options`
        );
      }
      userOptions.unauthenticatedOnly = true;
    }
    return {
      unauthenticatedOnly: userOptions.unauthenticatedOnly,
      navigateAuthenticatedTo: userOptions.navigateAuthenticatedTo ?? "/",
      navigateUnauthenticatedTo: userOptions.navigateUnauthenticatedTo
    };
  }
}
