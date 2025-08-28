import { getRequestURLWN } from "../composables/common/getRequestURL.js";
import { isExternalUrl } from "./url.js";
import { callWithNuxt, useNuxtApp, useRouter } from "#app";
export async function determineCallbackUrl(authConfig, userCallbackUrl, inferFromRequest) {
  if (userCallbackUrl) {
    return await normalizeCallbackUrl(userCallbackUrl);
  }
  const authConfigCallbackUrl = typeof authConfig.globalAppMiddleware === "object" ? authConfig.globalAppMiddleware.addDefaultCallbackUrl : void 0;
  if (typeof authConfigCallbackUrl === "string") {
    return await normalizeCallbackUrl(authConfigCallbackUrl);
  }
  const shouldInferFromRequest = inferFromRequest !== false && (inferFromRequest === true || authConfigCallbackUrl === true || authConfigCallbackUrl === void 0 && authConfig.globalAppMiddleware === true);
  if (shouldInferFromRequest) {
    const nuxt = useNuxtApp();
    return getRequestURLWN(nuxt);
  }
}
export function determineCallbackUrlForRouteMiddleware(authConfig, middlewareTo) {
  const authConfigCallbackUrl = typeof authConfig.globalAppMiddleware === "object" ? authConfig.globalAppMiddleware.addDefaultCallbackUrl : void 0;
  if (typeof authConfigCallbackUrl === "string") {
    return authConfigCallbackUrl;
  }
  if (authConfigCallbackUrl === true || authConfigCallbackUrl === void 0 && authConfig.globalAppMiddleware === true) {
    return middlewareTo.fullPath;
  }
}
async function normalizeCallbackUrl(rawCallbackUrl) {
  if (isExternalUrl(rawCallbackUrl)) {
    return rawCallbackUrl;
  }
  const nuxt = useNuxtApp();
  const router = await callWithNuxt(nuxt, useRouter);
  const resolvedUserRoute = router.options.history.createHref(rawCallbackUrl);
  return resolvedUserRoute;
}
