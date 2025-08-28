import type { DefaultRefreshHandlerConfig, ModuleOptionsNormalized, RefreshHandler } from '../types.js';
import { useAuth } from '#imports';
export declare class DefaultRefreshHandler implements RefreshHandler {
    config: DefaultRefreshHandlerConfig;
    /** Result of `useAuth` composable, mostly used for session data/refreshing */
    auth?: ReturnType<typeof useAuth>;
    /** Runtime config is mostly used for getting provider data */
    runtimeConfig?: ModuleOptionsNormalized;
    /** Refetch interval */
    refetchIntervalTimer?: ReturnType<typeof setInterval>;
    /** Refetch interval for local/refresh schema */
    refreshTokenIntervalTimer?: ReturnType<typeof setInterval>;
    /** Because passing `this.visibilityHandler` to `document.addEventHandler` loses `this` context */
    private boundVisibilityHandler;
    constructor(config: DefaultRefreshHandlerConfig);
    init(): void;
    destroy(): void;
    visibilityHandler(): void;
}
