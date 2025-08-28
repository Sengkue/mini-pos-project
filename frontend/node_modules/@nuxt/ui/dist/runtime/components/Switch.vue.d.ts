import type { SwitchRootProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/switch';
import type { ComponentConfig } from '../types/utils';
type Switch = ComponentConfig<typeof theme, AppConfig, 'switch'>;
export interface SwitchProps extends Pick<SwitchRootProps, 'disabled' | 'id' | 'name' | 'required' | 'value' | 'defaultValue'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'primary'
     */
    color?: Switch['variants']['color'];
    /**
     * @defaultValue 'md'
     */
    size?: Switch['variants']['size'];
    /** When `true`, the loading icon will be displayed. */
    loading?: boolean;
    /**
     * The icon when the `loading` prop is `true`.
     * @defaultValue appConfig.ui.icons.loading
     * @IconifyIcon
     */
    loadingIcon?: string;
    /**
     * Display an icon when the switch is checked.
     * @IconifyIcon
     */
    checkedIcon?: string;
    /**
     * Display an icon when the switch is unchecked.
     * @IconifyIcon
     */
    uncheckedIcon?: string;
    label?: string;
    description?: string;
    class?: any;
    ui?: Switch['slots'];
}
export type SwitchEmits = {
    change: [payload: Event];
};
export interface SwitchSlots {
    label(props: {
        label?: string;
    }): any;
    description(props: {
        description?: string;
    }): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<SwitchProps & {
    modelValue?: boolean;
}, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (payload: Event) => any;
    "update:modelValue": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<SwitchProps & {
    modelValue?: boolean;
}> & Readonly<{
    onChange?: ((payload: Event) => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, SwitchSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
