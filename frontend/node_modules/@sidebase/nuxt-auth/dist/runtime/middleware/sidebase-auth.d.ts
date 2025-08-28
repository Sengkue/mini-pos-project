type MiddlewareMeta = boolean | {
    /**
     * Whether to allow only unauthenticated users to access this page.
     *
     * Authenticated users will be redirected to `/` or the route defined in `navigateAuthenticatedTo`
     */
    unauthenticatedOnly: boolean;
    /**
     * Where to redirect authenticated users if `unauthenticatedOnly` is set to true
     *
     * @default undefined
     */
    navigateAuthenticatedTo?: string;
    /**
     * Where to redirect unauthenticated users if this page is protected
     *
     * @default undefined
     */
    navigateUnauthenticatedTo?: string;
};
declare module '#app' {
    interface PageMeta {
        auth?: MiddlewareMeta;
    }
}
declare module 'vue-router' {
    interface RouteMeta {
        auth?: MiddlewareMeta;
    }
}
declare const _default: import("#app").RouteMiddleware;
export default _default;
