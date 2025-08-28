import type { DeepRequired } from 'ts-essentials';
import type { ProviderAuthjs, ProviderLocal } from './types.js';
import type { useRuntimeConfig } from '#imports';
export declare const isProduction: boolean;
type RuntimeConfig = ReturnType<typeof useRuntimeConfig>;
export type ProviderAuthjsResolvedConfig = DeepRequired<ProviderAuthjs>;
export type ProviderLocalResolvedConfig = DeepRequired<ProviderLocal>;
export declare function useTypedBackendConfig(runtimeConfig: RuntimeConfig, type: 'authjs'): ProviderAuthjsResolvedConfig;
export declare function useTypedBackendConfig(runtimeConfig: RuntimeConfig, type: 'local'): ProviderLocalResolvedConfig;
/**
 * Get a property from an object following the JSON Pointer spec.
 *
 * RFC / Standard: https://www.rfc-editor.org/rfc/rfc6901
 *
 * Implementation adapted from https://github.com/manuelstofer/json-pointer/blob/931b0f9c7178ca09778087b4b0ac7e4f505620c2/index.js#L48-L59
 *
 * @param obj
 * @param pointer
 */
export declare function jsonPointerGet<TResult = string | Record<string, any>>(obj: Record<string, any>, pointer: string): TResult;
/**
 * Sets a value on an object
 *
 * RFC / Standard: https://www.rfc-editor.org/rfc/rfc6901
 *
 * Adapted from https://github.com/manuelstofer/json-pointer/blob/931b0f9c7178ca09778087b4b0ac7e4f505620c2/index.js#L68-L103
 */
export declare function jsonPointerSet(obj: Record<string, any>, pointer: string | string[], value: any): void;
/**
 * Creates an object from a value and a pointer.
 * This is equivalent to calling `jsonPointerSet` on an empty object.
 * @returns {Record<string, any>} An object with a value set at an arbitrary pointer.
 * @example objectFromJsonPointer('/refresh', 'someToken') // { refresh: 'someToken' }
 */
export declare function objectFromJsonPointer(pointer: string | string[], value: any): Record<string, any>;
export {};
