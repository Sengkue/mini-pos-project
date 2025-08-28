import type { RouteOptions } from '../types.js';
/**
 * Removes query params from url path.
 */
export declare function withoutQuery(path: string): string;
/**
 * Creates a route matcher using the user's paths.
 *
 * In the returned function, enter a path to retrieve the routeRules that applies to that page.
 */
export declare function getNitroRouteRules(path: string): Partial<RouteOptions>;
