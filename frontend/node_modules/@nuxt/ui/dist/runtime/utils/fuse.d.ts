import type { FuseResult } from 'fuse.js';
export declare function highlight<T>(item: T & {
    matches?: FuseResult<T>['matches'];
}, searchTerm: string, forceKey?: string, omitKeys?: string[]): string | undefined;
