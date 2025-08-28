import type { useNuxtApp } from '#imports';
export declare function _fetch<T>(nuxt: ReturnType<typeof useNuxtApp>, path: string, fetchOptions?: Parameters<typeof $fetch>[1], proxyCookies?: boolean): Promise<T>;
export declare class FetchConfigurationError extends Error {
}
