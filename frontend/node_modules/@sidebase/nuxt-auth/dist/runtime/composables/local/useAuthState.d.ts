import type { ComputedRef } from 'vue';
import type { CommonUseAuthStateReturn } from '../../types.js';
import type { CookieRef } from '#app';
import type { SessionData } from '#auth';
/**
 * The internal response of the local-specific auth data
 *
 * @remarks
 * The returned value `refreshToken` and `rawRefreshToken` will always be `null` if `refresh.isEnabled` is `false`
 */
export interface UseAuthStateReturn extends CommonUseAuthStateReturn<SessionData> {
    token: ComputedRef<string | null>;
    rawToken: CookieRef<string | null>;
    refreshToken: ComputedRef<string | null>;
    rawRefreshToken: CookieRef<string | null>;
    setToken: (newToken: string | null) => void;
    clearToken: () => void;
    _internal: {
        rawTokenCookie: CookieRef<string | null>;
    };
}
export declare function useAuthState(): UseAuthStateReturn;
export default useAuthState;
