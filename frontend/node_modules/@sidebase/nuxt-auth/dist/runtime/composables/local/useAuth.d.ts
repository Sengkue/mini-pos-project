import type { Ref } from 'vue';
import type { CommonUseAuthReturn, SecondarySignInOptions, SignOutOptions, SignUpOptions } from '../../types.js';
import type { SessionData } from '#auth';
interface Credentials extends Record<string, any> {
    username?: string;
    email?: string;
    password?: string;
}
export interface SignInFunc<T = Record<string, any>> {
    (credentials: Credentials, signInOptions?: SecondarySignInOptions, paramsOptions?: Record<string, string>, headersOptions?: Record<string, string>): Promise<T | undefined>;
}
export interface SignUpFunc<T = Record<string, any>> {
    (credentials: Credentials, signUpOptions?: SignUpOptions): Promise<T | undefined>;
}
export interface SignOutFunc<T = unknown> {
    (options?: SignOutOptions): Promise<T | undefined>;
}
/**
 * Returns an extended version of CommonUseAuthReturn with local-provider specific data
 *
 * @remarks
 * The returned value of `refreshToken` will always be `null` if `refresh.isEnabled` is `false`
 */
interface UseAuthReturn extends CommonUseAuthReturn<SignInFunc, SignOutFunc, SessionData> {
    signUp: SignUpFunc;
    token: Readonly<Ref<string | null>>;
    refreshToken: Readonly<Ref<string | null>>;
}
export declare function useAuth(): UseAuthReturn;
export {};
