import { computed, getCurrentInstance, watch } from "vue";
import { makeCommonAuthState } from "../commonAuthState.js";
import { useTypedBackendConfig } from "../../helpers.js";
import { formatToken } from "./utils/token.js";
import { onMounted, useCookie, useRuntimeConfig, useState } from "#imports";
export function useAuthState() {
  const config = useTypedBackendConfig(useRuntimeConfig(), "local");
  const commonAuthState = makeCommonAuthState();
  const instance = getCurrentInstance();
  const _rawTokenCookie = useCookie(config.token.cookieName, {
    default: () => null,
    domain: config.token.cookieDomain,
    maxAge: config.token.maxAgeInSeconds,
    sameSite: config.token.sameSiteAttribute,
    secure: config.token.secureCookieAttribute,
    httpOnly: config.token.httpOnlyCookieAttribute
  });
  const rawToken = useState("auth:raw-token", () => _rawTokenCookie.value);
  watch(rawToken, () => {
    _rawTokenCookie.value = rawToken.value;
  });
  const token = computed(() => formatToken(rawToken.value, config));
  function setToken(newToken) {
    rawToken.value = newToken;
  }
  function clearToken() {
    setToken(null);
  }
  if (instance) {
    onMounted(() => {
      if (_rawTokenCookie.value && !rawToken.value) {
        setToken(_rawTokenCookie.value);
      }
    });
  }
  const rawRefreshToken = useState("auth:raw-refresh-token", () => null);
  if (config.refresh.isEnabled) {
    const _rawRefreshTokenCookie = useCookie(config.refresh.token.cookieName, {
      default: () => null,
      domain: config.refresh.token.cookieDomain,
      maxAge: config.refresh.token.maxAgeInSeconds,
      sameSite: config.refresh.token.sameSiteAttribute,
      secure: config.refresh.token.secureCookieAttribute,
      httpOnly: config.refresh.token.httpOnlyCookieAttribute
    });
    if (rawRefreshToken.value === null) {
      rawRefreshToken.value = _rawRefreshTokenCookie.value;
    }
    watch(rawRefreshToken, () => {
      _rawRefreshTokenCookie.value = rawRefreshToken.value;
    });
    if (instance) {
      onMounted(() => {
        if (_rawRefreshTokenCookie.value && !rawRefreshToken.value) {
          rawRefreshToken.value = _rawRefreshTokenCookie.value;
        }
      });
    }
  }
  const refreshToken = computed(() => rawRefreshToken.value);
  return {
    ...commonAuthState,
    token,
    rawToken,
    refreshToken,
    rawRefreshToken,
    setToken,
    clearToken,
    _internal: {
      rawTokenCookie: _rawTokenCookie
    }
  };
}
export default useAuthState;
