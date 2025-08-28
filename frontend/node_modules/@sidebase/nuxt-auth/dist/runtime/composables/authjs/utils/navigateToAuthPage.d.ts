import type { NuxtApp } from '#app';
export declare function navigateToAuthPageWN(nuxt: NuxtApp, href: string, isInternalRouting?: boolean): Promise<void> | Promise<Promise<void>>;
/**
 * Adapted from https://github.com/nuxt/nuxt/blob/16d213bbdcc69c0cc72afb355755ff877654a374/packages/nuxt/src/app/composables/router.ts#L270C1-L282C2
 * @internal
 */
export declare function encodeURL(location: string, isExternalHost?: boolean): string;
