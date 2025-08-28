import { useAuth, useRuntimeConfig } from "#imports";
export class DefaultRefreshHandler {
  constructor(config) {
    this.config = config;
    this.boundVisibilityHandler = this.visibilityHandler.bind(this);
  }
  /** Result of `useAuth` composable, mostly used for session data/refreshing */
  auth;
  /** Runtime config is mostly used for getting provider data */
  runtimeConfig;
  /** Refetch interval */
  refetchIntervalTimer;
  // TODO: find more Generic method to start a Timer for the Refresh Token
  /** Refetch interval for local/refresh schema */
  refreshTokenIntervalTimer;
  /** Because passing `this.visibilityHandler` to `document.addEventHandler` loses `this` context */
  boundVisibilityHandler;
  init() {
    this.runtimeConfig = useRuntimeConfig().public.auth;
    this.auth = useAuth();
    document.addEventListener("visibilitychange", this.boundVisibilityHandler, false);
    const { enablePeriodically } = this.config;
    if (enablePeriodically !== false && enablePeriodically !== void 0) {
      const intervalTime = enablePeriodically === true ? 1e3 : safeTimerDelay(enablePeriodically);
      this.refetchIntervalTimer = setInterval(() => {
        if (this.auth?.data.value) {
          this.auth.refresh();
        }
      }, intervalTime);
    }
    const provider = this.runtimeConfig.provider;
    if (provider.type === "local" && provider.refresh.isEnabled && provider.refresh.token?.maxAgeInSeconds) {
      const intervalTime = safeTimerDelay(provider.refresh.token.maxAgeInSeconds * 1e3);
      this.refreshTokenIntervalTimer = setInterval(() => {
        if (this.auth?.refreshToken.value) {
          this.auth.refresh();
        }
      }, intervalTime);
    }
  }
  destroy() {
    document.removeEventListener("visibilitychange", this.boundVisibilityHandler, false);
    clearInterval(this.refetchIntervalTimer);
    if (this.refreshTokenIntervalTimer) {
      clearInterval(this.refreshTokenIntervalTimer);
    }
    this.auth = void 0;
    this.runtimeConfig = void 0;
  }
  visibilityHandler() {
    if (this.config?.enableOnWindowFocus && document.visibilityState === "visible" && this.auth?.data.value) {
      this.auth.refresh();
    }
  }
}
const MAX_SAFE_INTERVAL_MS = 2147483647;
function safeTimerDelay(milliseconds) {
  return Math.min(milliseconds, MAX_SAFE_INTERVAL_MS);
}
