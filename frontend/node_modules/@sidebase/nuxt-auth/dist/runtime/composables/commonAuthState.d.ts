import type { SessionLastRefreshedAt, SessionStatus } from '../types.js';
export declare function makeCommonAuthState<SessionData>(): {
    data: import("vue").Ref<SessionData | null | undefined, SessionData | null | undefined>;
    loading: import("vue").Ref<boolean, boolean>;
    lastRefreshedAt: import("vue").Ref<SessionLastRefreshedAt, SessionLastRefreshedAt>;
    status: import("vue").ComputedRef<SessionStatus>;
};
