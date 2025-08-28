export const isProduction = process.env.NODE_ENV === "production";
export function useTypedBackendConfig(runtimeConfig, type) {
  const provider = runtimeConfig.public.auth.provider;
  if (provider.type === type) {
    return provider;
  }
  throw new Error("RuntimeError: Type must match at this point");
}
export function jsonPointerGet(obj, pointer) {
  const refTokens = Array.isArray(pointer) ? pointer : jsonPointerParse(pointer);
  for (let i = 0; i < refTokens.length; ++i) {
    const tok = refTokens[i];
    if (!(typeof obj === "object" && tok in obj)) {
      throw new Error(`Invalid reference token: ${tok}`);
    }
    obj = obj[tok];
  }
  return obj;
}
export function jsonPointerSet(obj, pointer, value) {
  const refTokens = Array.isArray(pointer) ? pointer : jsonPointerParse(pointer);
  let nextTok = refTokens[0];
  if (refTokens.length === 0) {
    throw new Error("Can not set the root object");
  }
  for (let i = 0; i < refTokens.length - 1; ++i) {
    let tok = refTokens[i];
    if (typeof tok !== "string" && typeof tok !== "number") {
      tok = String(tok);
    }
    if (tok === "__proto__" || tok === "constructor" || tok === "prototype") {
      continue;
    }
    if (tok === "-" && Array.isArray(obj)) {
      tok = obj.length;
    }
    nextTok = refTokens[i + 1];
    if (!(tok in obj)) {
      if (nextTok.match(/^(\d+|-)$/)) {
        obj[tok] = [];
      } else {
        obj[tok] = {};
      }
    }
    obj = obj[tok];
  }
  if (nextTok === "-" && Array.isArray(obj)) {
    nextTok = obj.length;
  }
  obj[nextTok] = value;
}
export function objectFromJsonPointer(pointer, value) {
  const result = {};
  jsonPointerSet(result, pointer, value);
  return result;
}
function jsonPointerParse(pointer) {
  if (pointer === "" || pointer === "/") {
    return [];
  }
  if (pointer.charAt(0) !== "/") {
    throw new Error(`Invalid JSON pointer: ${pointer}`);
  }
  return pointer.substring(1).split(/\//).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
}
