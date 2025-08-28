import type { AppProvider, BuiltInProviderType } from 'next-auth/providers/index';
import type { CommonUseAuthReturn, GetSessionOptions, SecondarySignInOptions, SignOutOptions } from '../../types.js';
import type { SessionData } from './useAuthState.js';
/**
 * Utility type that allows autocompletion for a mix of literal, primitiva and non-primitive values.
 * @source https://github.com/microsoft/TypeScript/issues/29729#issuecomment-832522611
 */
type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);
export type SupportedProviders = LiteralUnion<BuiltInProviderType> | undefined;
interface SignInResult {
    error: string | null;
    status: number;
    ok: boolean;
    url: any;
}
export interface SignInFunc {
    (provider: SupportedProviders, signInOptions?: SecondarySignInOptions, paramsOptions?: Record<string, string>, headersOptions?: Record<string, string>): Promise<SignInResult>;
}
export interface SignOutFunc<T = unknown> {
    (options?: SignOutOptions): Promise<T | undefined>;
}
export interface GetSessionFunc {
    (getSessionOptions?: GetSessionOptions): Promise<SessionData | null | void>;
}
export interface GetCsrfTokenFunc {
    (): Promise<string>;
}
export type GetProvidersResult = Record<Exclude<SupportedProviders, undefined>, Omit<AppProvider, 'options'> | undefined>;
export interface GetProvidersFunc {
    (): Promise<GetProvidersResult>;
}
interface UseAuthReturn extends CommonUseAuthReturn<SignInFunc, SignOutFunc, SessionData> {
    getCsrfToken: GetCsrfTokenFunc;
    getProviders: GetProvidersFunc;
}
export declare function useAuth(): UseAuthReturn;
export default useAuth;
