import type { LinkProps } from '../types';
export interface LinkBaseProps {
    as?: string;
    type?: string;
    disabled?: boolean;
    onClick?: ((e: MouseEvent) => void | Promise<void>) | Array<((e: MouseEvent) => void | Promise<void>)>;
    href?: string;
    navigate?: (e: MouseEvent) => void;
    target?: LinkProps['target'];
    rel?: LinkProps['rel'];
    active?: boolean;
    isExternal?: boolean;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<LinkBaseProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<LinkBaseProps> & Readonly<{}>, {
    type: string;
    as: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, {
    default?: (props: {}) => any;
}>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
