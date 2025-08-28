import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/alert';
import type { AvatarProps, ButtonProps } from '../types';
import type { ComponentConfig } from '../types/utils';
type Alert = ComponentConfig<typeof theme, AppConfig, 'alert'>;
export interface AlertProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    title?: string;
    description?: string;
    /**
     * @IconifyIcon
     */
    icon?: string;
    avatar?: AvatarProps;
    /**
     * @defaultValue 'primary'
     */
    color?: Alert['variants']['color'];
    /**
     * @defaultValue 'solid'
     */
    variant?: Alert['variants']['variant'];
    /**
     * The orientation between the content and the actions.
     * @defaultValue 'vertical'
     */
    orientation?: Alert['variants']['orientation'];
    /**
     * Display a list of actions:
     * - under the title and description when orientation is `vertical`
     * - next to the close button when orientation is `horizontal`
     * `{ size: 'xs' }`{lang="ts-type"}
     */
    actions?: ButtonProps[];
    /**
     * Display a close button to dismiss the alert.
     * `{ size: 'md', color: 'neutral', variant: 'link' }`{lang="ts-type"}
     * @emits 'update:open'
     * @defaultValue false
     */
    close?: boolean | Partial<ButtonProps>;
    /**
     * The icon displayed in the close button.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    closeIcon?: string;
    class?: any;
    ui?: Alert['slots'];
}
export interface AlertEmits {
    'update:open': [value: boolean];
}
export interface AlertSlots {
    leading(props?: {}): any;
    title(props?: {}): any;
    description(props?: {}): any;
    actions(props?: {}): any;
    close(props: {
        ui: {
            [K in keyof Required<Alert['slots']>]: (props?: Record<string, any>) => string;
        };
    }): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<AlertProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<AlertProps> & Readonly<{
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
}>, {
    orientation: Alert["variants"]["orientation"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, AlertSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
