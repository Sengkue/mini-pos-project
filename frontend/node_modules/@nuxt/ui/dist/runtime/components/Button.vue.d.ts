import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/button';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { LinkProps } from '../types';
import type { ComponentConfig } from '../types/utils';
type Button = ComponentConfig<typeof theme, AppConfig, 'button'>;
export interface ButtonProps extends UseComponentIconsProps, Omit<LinkProps, 'raw' | 'custom'> {
    label?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: Button['variants']['color'];
    activeColor?: Button['variants']['color'];
    /**
     * @defaultValue 'solid'
     */
    variant?: Button['variants']['variant'];
    activeVariant?: Button['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: Button['variants']['size'];
    /** Render the button with equal padding on all sides. */
    square?: boolean;
    /** Render the button full width. */
    block?: boolean;
    /** Set loading state automatically based on the `@click` promise state */
    loadingAuto?: boolean;
    onClick?: ((event: MouseEvent) => void | Promise<void>) | Array<((event: MouseEvent) => void | Promise<void>)>;
    class?: any;
    ui?: Button['slots'];
}
export interface ButtonSlots {
    leading(props?: {}): any;
    default(props?: {}): any;
    trailing(props?: {}): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<ButtonProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ButtonProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ButtonSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
