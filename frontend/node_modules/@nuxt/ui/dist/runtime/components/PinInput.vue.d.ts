import type { ComponentPublicInstance } from 'vue';
import type { PinInputRootEmits, PinInputRootProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/pin-input';
import type { ComponentConfig } from '../types/utils';
type PinInput = ComponentConfig<typeof theme, AppConfig, 'pinInput'>;
type PinInputType = 'text' | 'number';
export interface PinInputProps<T extends PinInputType = 'text'> extends Pick<PinInputRootProps<T>, 'defaultValue' | 'disabled' | 'id' | 'mask' | 'modelValue' | 'name' | 'otp' | 'placeholder' | 'required' | 'type'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'primary'
     */
    color?: PinInput['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: PinInput['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: PinInput['variants']['size'];
    /**
     * The number of input fields.
     * @defaultValue 5
     */
    length?: number | string;
    autofocus?: boolean;
    autofocusDelay?: number;
    highlight?: boolean;
    class?: any;
    ui?: PinInput['slots'];
}
export type PinInputEmits<T extends PinInputType = 'text'> = PinInputRootEmits<T> & {
    change: [payload: Event];
    blur: [payload: Event];
};
declare const _default: <T extends PinInputType>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onBlur?: ((payload: Event) => any) | undefined;
        readonly onComplete?: ((value: [T] extends ["number"] ? number[] : string[]) => any) | undefined;
        readonly onChange?: ((payload: Event) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((value: [T] extends ["number"] ? number[] : string[]) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onBlur" | "onChange" | "onUpdate:modelValue" | "onComplete"> & PinInputProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        inputsRef: import("vue").Ref<ComponentPublicInstance[], ComponentPublicInstance[]>;
    }>): void;
    attrs: any;
    slots: {};
    emit: ((evt: "blur", payload: Event) => void) & ((evt: "complete", value: [T] extends ["number"] ? number[] : string[]) => void) & ((evt: "change", payload: Event) => void) & ((evt: "update:modelValue", value: [T] extends ["number"] ? number[] : string[]) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
