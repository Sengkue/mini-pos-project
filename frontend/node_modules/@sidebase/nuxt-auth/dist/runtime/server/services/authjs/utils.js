import { getRequestURL } from "h3";
import { parseURL, withLeadingSlash } from "ufo";
import { resolveApiBaseURL } from "../../../utils/url.js";
import { ERROR_MESSAGES } from "../errors.js";
export function getHostValueForAuthjs(event, runtimeConfig, trustHostUserPreference, isProduction) {
  return getServerBaseUrl(runtimeConfig, true, trustHostUserPreference, isProduction, event);
}
export function getServerBaseUrl(runtimeConfig, includePath, trustHostUserPreference, isProduction, event) {
  const baseURL = resolveApiBaseURL(runtimeConfig, false);
  const parsed = parseURL(baseURL);
  if (parsed.protocol && parsed.host) {
    const base = `${parsed.protocol}//${parsed.host}`;
    return includePath ? `${base}${parsed.pathname}${parsed.search || ""}${parsed.hash || ""}` : base;
  }
  if (event && (!isProduction || trustHostUserPreference)) {
    const requestUrl = getRequestURL(event, {
      xForwardedHost: trustHostUserPreference,
      xForwardedProto: trustHostUserPreference || void 0
    });
    if (!includePath) {
      return requestUrl.origin;
    }
    const basePath = withLeadingSlash(parsed.pathname);
    requestUrl.pathname = basePath;
    return requestUrl.href;
  }
  throw new Error(ERROR_MESSAGES.NO_ORIGIN);
}
