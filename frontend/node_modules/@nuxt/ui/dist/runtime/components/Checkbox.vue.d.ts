import type { CheckboxRootProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/checkbox';
import type { ComponentConfig } from '../types/utils';
type Checkbox = ComponentConfig<typeof theme, AppConfig, 'checkbox'>;
export interface CheckboxProps extends Pick<CheckboxRootProps, 'disabled' | 'required' | 'name' | 'value' | 'id' | 'defaultValue'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    label?: string;
    description?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: Checkbox['variants']['color'];
    /**
     * @defaultValue 'list'
     */
    variant?: Checkbox['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: Checkbox['variants']['size'];
    /**
     * Position of the indicator.
     * @defaultValue 'start'
     */
    indicator?: Checkbox['variants']['indicator'];
    /**
     * The icon displayed when checked.
     * @defaultValue appConfig.ui.icons.check
     * @IconifyIcon
     */
    icon?: string;
    /**
     * The icon displayed when the checkbox is indeterminate.
     * @defaultValue appConfig.ui.icons.minus
     * @IconifyIcon
     */
    indeterminateIcon?: string;
    class?: any;
    ui?: Checkbox['slots'];
}
export type CheckboxEmits = {
    change: [payload: Event];
};
export interface CheckboxSlots {
    label(props: {
        label?: string;
    }): any;
    description(props: {
        description?: string;
    }): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<CheckboxProps & {
    modelValue?: boolean | "indeterminate";
}, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (payload: Event) => any;
    "update:modelValue": (value: boolean | "indeterminate") => any;
}, string, import("vue").PublicProps, Readonly<CheckboxProps & {
    modelValue?: boolean | "indeterminate";
}> & Readonly<{
    onChange?: ((payload: Event) => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean | "indeterminate") => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, CheckboxSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
