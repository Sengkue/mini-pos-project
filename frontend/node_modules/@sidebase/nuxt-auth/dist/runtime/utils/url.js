import { joinURL, parseURL, withLeadingSlash } from "ufo";
export function resolveApiUrlPath(endpointPath, runtimeConfig) {
  if (isExternalUrl(endpointPath)) {
    return endpointPath;
  }
  const baseURL = resolveApiBaseURL(runtimeConfig);
  return joinURL(baseURL, endpointPath);
}
export function resolveApiBaseURL(runtimeConfig, returnOnlyPathname) {
  const authRuntimeConfig = runtimeConfig.public.auth;
  if (returnOnlyPathname === void 0) {
    returnOnlyPathname = !runtimeConfig.public.auth.disableInternalRouting;
  }
  let baseURL = authRuntimeConfig.baseURL;
  if (import.meta.server !== false && authRuntimeConfig.originEnvKey) {
    const envBaseURL = process.env[authRuntimeConfig.originEnvKey];
    if (envBaseURL) {
      baseURL = envBaseURL;
    }
  }
  if (returnOnlyPathname) {
    baseURL = withLeadingSlash(parseURL(baseURL).pathname);
  }
  return baseURL;
}
export function isExternalUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}
