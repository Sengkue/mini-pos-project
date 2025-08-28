export interface RuntimeConfig {
    public: {
        auth: {
            baseURL: string;
            disableInternalRouting: boolean;
            originEnvKey: string;
        };
    };
}
/** https://auth.sidebase.io/guide/application-side/configuration#baseurl */
export declare function resolveApiUrlPath(endpointPath: string, runtimeConfig: RuntimeConfig): string;
export declare function resolveApiBaseURL(runtimeConfig: RuntimeConfig, returnOnlyPathname?: boolean): string;
/**
 * Naively checks if a URL is external or not by comparing against its protocol.
 *
 * URL being valid is not a concern for this function as it is used with developer-controlled inputs.
 */
export declare function isExternalUrl(url: string): boolean;
