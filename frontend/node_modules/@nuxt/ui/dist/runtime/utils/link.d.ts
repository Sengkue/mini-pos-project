import type { LinkProps } from '../types';
export declare function pickLinkProps(link: LinkProps & {
    [key: string]: any;
}): import("@vueuse/shared").ReactivePickReturn<LinkProps & {
    [key: string]: any;
}, string>;
export declare function isPartiallyEqual(item1: any, item2: any): boolean;
