import { createError, eventHandler, getHeaders, getQuery, getResponseHeader, isMethod, parseCookies, readBody, sendRedirect, setCookie, setResponseHeader } from "h3";
import { AuthHandler } from "next-auth/core";
import { getToken as authjsGetToken } from "next-auth/jwt";
import { defu } from "defu";
import { joinURL } from "ufo";
import { ERROR_MESSAGES } from "../errors.js";
import { isNonEmptyObject } from "../../../utils/checkSessionResult.js";
import { isProduction, useTypedBackendConfig } from "../../../helpers.js";
import { resolveApiBaseURL } from "../../../utils/url.js";
import { getHostValueForAuthjs, getServerBaseUrl } from "./utils.js";
import { useRuntimeConfig } from "#imports";
let preparedAuthjsHandler;
let usedSecret;
export function NuxtAuthHandler(nuxtAuthOptions) {
  const isProduction2 = process.env.NODE_ENV === "production";
  const runtimeConfig = useRuntimeConfig();
  const trustHostUserPreference = useTypedBackendConfig(runtimeConfig, "authjs").trustHost;
  usedSecret = nuxtAuthOptions?.secret;
  if (!usedSecret) {
    if (isProduction2) {
      throw new Error(ERROR_MESSAGES.NO_SECRET);
    } else {
      console.info(ERROR_MESSAGES.NO_SECRET);
      usedSecret = "secret";
    }
  }
  const options = defu(nuxtAuthOptions, {
    secret: usedSecret,
    logger: void 0,
    providers: [],
    // SAFETY: We trust host here because `getHostValueForAuthjs` is responsible for producing a trusted URL
    trustHost: true,
    // AuthJS uses `/auth` as default, but we rely on `/api/auth` (same as in previous `next-auth`)
    basePath: runtimeConfig.public.auth.baseURL
    // Uncomment to enable framework-author specific functionality
    // raw: raw as typeof raw
  });
  if (preparedAuthjsHandler) {
    console.error("You setup the auth handler for a second time - this is likely undesired. Make sure that you only call `NuxtAuthHandler( ... )` once");
  }
  preparedAuthjsHandler = (req) => AuthHandler({ req, options });
  return eventHandler(async (event) => {
    const { res } = event.node;
    const nextRequest = await createRequestForAuthjs(event, runtimeConfig, trustHostUserPreference);
    const nextResult = await preparedAuthjsHandler(nextRequest);
    if (nextResult.status) {
      res.statusCode = nextResult.status;
    }
    nextResult.cookies?.forEach((cookie) => setCookieDeduped(event, cookie.name, cookie.value, cookie.options));
    nextResult.headers?.forEach((header) => appendHeaderDeduped(event, header.key, header.value));
    if (!nextResult.redirect) {
      return nextResult.body;
    }
    if (nextRequest.body?.json) {
      return { url: nextResult.redirect };
    }
    return await sendRedirect(event, nextResult.redirect);
  });
}
export async function getServerSession(event) {
  const runtimeConfig = useRuntimeConfig();
  const authBasePathname = resolveApiBaseURL(runtimeConfig, true);
  const trustHostUserPreference = useTypedBackendConfig(runtimeConfig, "authjs").trustHost;
  if (event.path && event.path.startsWith(authBasePathname)) {
    return null;
  }
  const sessionUrlPath = joinURL(authBasePathname, "/session");
  const headers = getHeaders(event);
  if (!preparedAuthjsHandler) {
    await $fetch(sessionUrlPath, { headers }).catch((error) => error.data);
    if (!preparedAuthjsHandler) {
      throw createError({ statusCode: 500, message: "Tried to get server session without setting up an endpoint to handle authentication (see https://github.com/sidebase/nuxt-auth#quick-start)" });
    }
  }
  const authjsRequest = {
    action: "session",
    method: "GET",
    headers,
    body: void 0,
    cookies: parseCookies(event),
    providerId: void 0,
    error: void 0,
    host: getHostValueForAuthjs(event, runtimeConfig, trustHostUserPreference, isProduction),
    query: {}
  };
  const authjsResponse = await preparedAuthjsHandler(authjsRequest);
  const session = authjsResponse.body;
  if (isNonEmptyObject(session)) {
    return session;
  }
  return null;
}
export function getToken({ event, secureCookie, secret, ...rest }) {
  const runtimeConfig = useRuntimeConfig();
  const trustHostUserPreference = useTypedBackendConfig(runtimeConfig, "authjs").trustHost;
  return authjsGetToken({
    // @ts-expect-error As our request is not a real next-auth request, we pass down only what's required for the method, as per code from https://github.com/nextauthjs/next-auth/blob/8387c78e3fef13350d8a8c6102caeeb05c70a650/packages/next-auth/src/jwt/index.ts#L68
    req: {
      cookies: parseCookies(event),
      headers: getHeaders(event)
    },
    // see https://github.com/nextauthjs/next-auth/blob/8387c78e3fef13350d8a8c6102caeeb05c70a650/packages/next-auth/src/jwt/index.ts#L73
    secureCookie: secureCookie ?? getServerBaseUrl(runtimeConfig, false, trustHostUserPreference, isProduction, event).startsWith("https://"),
    secret: secret || usedSecret,
    ...rest
  });
}
async function createRequestForAuthjs(event, runtimeConfig, trustHostUserPreference) {
  const nextRequest = {
    // `authjs` expects the baseURL here despite the param name
    host: getHostValueForAuthjs(event, runtimeConfig, trustHostUserPreference, isProduction),
    body: void 0,
    cookies: parseCookies(event),
    query: void 0,
    headers: getHeaders(event),
    method: event.method,
    providerId: void 0,
    error: void 0
  };
  const query = getQuery(event);
  const { action, providerId } = parseActionAndProvider(event);
  const error = query.error;
  if (Array.isArray(error)) {
    throw createError({ statusCode: 400, message: "Error query parameter can only appear once" });
  }
  const body = isMethod(event, ["PATCH", "POST", "PUT", "DELETE"]) ? await readBody(event) : void 0;
  return {
    ...nextRequest,
    body,
    query,
    action,
    providerId,
    error: error ? String(error) : void 0
  };
}
const SUPPORTED_ACTIONS = ["providers", "session", "csrf", "signin", "signout", "callback", "verify-request", "error", "_log"];
function parseActionAndProvider({ context }) {
  const params = context.params?._?.split("/");
  if (!params || ![1, 2].includes(params.length)) {
    throw createError({ statusCode: 400, message: `Invalid path used for auth-endpoint. Supply either one path parameter (e.g., \`/api/auth/session\`) or two (e.g., \`/api/auth/signin/github\` after the base path (in previous examples base path was: \`/api/auth/\`. Received \`${params}\`` });
  }
  const [unvalidatedAction, providerId] = params;
  const action = SUPPORTED_ACTIONS.find((action2) => action2 === unvalidatedAction);
  if (!action) {
    throw createError({ statusCode: 400, message: `Called endpoint with unsupported action ${unvalidatedAction}. Only the following actions are supported: ${SUPPORTED_ACTIONS.join(", ")}` });
  }
  return { action, providerId };
}
function appendHeaderDeduped(event, name, value) {
  let current = getResponseHeader(event, name);
  if (!current) {
    setResponseHeader(event, name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  if (current.includes(value)) {
    return;
  }
  current.push(value);
  setResponseHeader(event, name, current);
}
function setCookieDeduped(event, name, value, serializeOptions) {
  let setCookiesHeader = getResponseHeader(event, "set-cookie");
  if (setCookiesHeader) {
    if (!Array.isArray(setCookiesHeader)) {
      setCookiesHeader = [setCookiesHeader.toString()];
    }
    const filterBy = `${name}=`;
    setCookiesHeader = setCookiesHeader.filter((cookie) => !cookie.startsWith(filterBy));
    setResponseHeader(event, "set-cookie", setCookiesHeader);
  }
  setCookie(event, name, value, serializeOptions);
}
