import type { RouteMiddleware } from '#app';
/** Slimmed down auth runtime config for `determineCallbackUrl` */
interface AuthRuntimeConfigForCallbackUrl {
    globalAppMiddleware: {
        addDefaultCallbackUrl?: string | boolean;
    } | boolean;
}
export declare function determineCallbackUrl(authConfig: AuthRuntimeConfigForCallbackUrl, userCallbackUrl: string | undefined, inferFromRequest: true): Promise<string>;
export declare function determineCallbackUrl(authConfig: AuthRuntimeConfigForCallbackUrl, userCallbackUrl: string | undefined, inferFromRequest?: false | undefined): Promise<string | undefined>;
type RouteLocationNormalized = Parameters<RouteMiddleware>[0];
/**
 * Determines the correct callback URL for usage with Nuxt Route Middleware.
 * The difference with a plain `determineCallbackUrl` is that this function produces
 * non-normalized URLs. It is done because the result is being passed to `signIn` which does normalization.
 *
 * @param authConfig NuxtAuth module config (`runtimeConfig.public.auth`)
 * @param middlewareTo The `to` parameter of NuxtRouteMiddleware
 */
export declare function determineCallbackUrlForRouteMiddleware(authConfig: AuthRuntimeConfigForCallbackUrl, middlewareTo: RouteLocationNormalized): string | undefined;
export {};
