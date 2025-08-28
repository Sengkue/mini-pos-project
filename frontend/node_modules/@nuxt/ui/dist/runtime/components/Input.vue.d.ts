import type { InputHTMLAttributes } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/input';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { AcceptableValue, ComponentConfig } from '../types/utils';
type Input = ComponentConfig<typeof theme, AppConfig, 'input'>;
export interface InputProps<T extends AcceptableValue = AcceptableValue> extends UseComponentIconsProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    id?: string;
    name?: string;
    type?: InputHTMLAttributes['type'];
    /** The placeholder text when the input is empty. */
    placeholder?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: Input['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: Input['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: Input['variants']['size'];
    required?: boolean;
    autocomplete?: InputHTMLAttributes['autocomplete'];
    autofocus?: boolean;
    autofocusDelay?: number;
    disabled?: boolean;
    /** Highlight the ring color like a focus state. */
    highlight?: boolean;
    modelValue?: T;
    defaultValue?: T;
    modelModifiers?: {
        string?: boolean;
        number?: boolean;
        trim?: boolean;
        lazy?: boolean;
        nullify?: boolean;
    };
    class?: any;
    ui?: Input['slots'];
}
export interface InputEmits<T extends AcceptableValue = AcceptableValue> {
    'update:modelValue': [payload: T];
    'blur': [event: FocusEvent];
    'change': [event: Event];
}
export interface InputSlots {
    leading(props?: {}): any;
    default(props?: {}): any;
    trailing(props?: {}): any;
}
declare const _default: <T extends AcceptableValue>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onBlur?: ((event: FocusEvent) => any) | undefined;
        readonly onChange?: ((event: Event) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((payload: T) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onBlur" | "onChange" | "onUpdate:modelValue"> & InputProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        inputRef: import("vue").Ref<HTMLInputElement | null, HTMLInputElement | null>;
    }>): void;
    attrs: any;
    slots: InputSlots;
    emit: ((evt: "blur", event: FocusEvent) => void) & ((evt: "change", event: Event) => void) & ((evt: "update:modelValue", payload: T) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
