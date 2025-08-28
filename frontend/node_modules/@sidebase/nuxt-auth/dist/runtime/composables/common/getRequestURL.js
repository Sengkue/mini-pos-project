import getURL from "requrl";
import { callWithNuxt, useRequestEvent } from "#app";
export function getRequestURL(includePath = true) {
  return getURL(useRequestEvent()?.node.req, includePath);
}
export function getRequestURLWN(nuxt) {
  return callWithNuxt(nuxt, getRequestURL);
}
