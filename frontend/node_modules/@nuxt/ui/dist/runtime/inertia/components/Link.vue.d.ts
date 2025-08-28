import type { ButtonHTMLAttributes } from 'vue';
import type { InertiaLinkProps } from '@inertiajs/vue3';
interface NuxtLinkProps extends Omit<InertiaLinkProps, 'href' | 'onClick'> {
    activeClass?: string;
    /**
     * Route Location the link should navigate to when clicked on.
     */
    to?: string;
    /**
     * An alias for `to`. If used with `to`, `href` will be ignored
     */
    href?: NuxtLinkProps['to'];
    /**
     * Forces the link to be considered as external (true) or internal (false). This is helpful to handle edge-cases
     */
    external?: boolean;
    /**
     * Where to display the linked URL, as the name for a browsing context.
     */
    target?: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null;
    ariaCurrentValue?: string;
}
export interface LinkProps extends NuxtLinkProps {
    /**
     * The element or component this component should render as when not a link.
     * @defaultValue 'button'
     */
    as?: any;
    /**
     * The type of the button when not a link.
     * @defaultValue 'button'
     */
    type?: ButtonHTMLAttributes['type'];
    disabled?: boolean;
    /** Force the link to be active independent of the current route. */
    active?: boolean;
    /** Will only be active if the current route is an exact match. */
    exact?: boolean;
    /** The class to apply when the link is inactive. */
    inactiveClass?: string;
    custom?: boolean;
    /** When `true`, only styles from `class`, `activeClass`, and `inactiveClass` will be applied. */
    raw?: boolean;
    class?: any;
}
export interface LinkSlots {
    default(props: {
        active: boolean;
    }): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<LinkProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<LinkProps> & Readonly<{}>, {
    type: "reset" | "submit" | "button";
    as: any;
    activeClass: string;
    active: boolean;
    inactiveClass: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, LinkSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
