import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/textarea';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { ComponentConfig } from '../types/utils';
type Textarea = ComponentConfig<typeof theme, AppConfig, 'textarea'>;
type TextareaValue = string | number | null;
export interface TextareaProps<T extends TextareaValue = TextareaValue> extends UseComponentIconsProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    id?: string;
    name?: string;
    /** The placeholder text when the textarea is empty. */
    placeholder?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: Textarea['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: Textarea['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: Textarea['variants']['size'];
    required?: boolean;
    autofocus?: boolean;
    autofocusDelay?: number;
    autoresize?: boolean;
    autoresizeDelay?: number;
    disabled?: boolean;
    rows?: number;
    maxrows?: number;
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
    ui?: Textarea['slots'];
}
export interface TextareaEmits<T extends TextareaValue = TextareaValue> {
    'update:modelValue': [payload: T];
    'blur': [event: FocusEvent];
    'change': [event: Event];
}
export interface TextareaSlots {
    leading(props?: {}): any;
    default(props?: {}): any;
    trailing(props?: {}): any;
}
declare const _default: <T extends TextareaValue>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onBlur?: ((event: FocusEvent) => any) | undefined;
        readonly onChange?: ((event: Event) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((payload: T) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onBlur" | "onChange" | "onUpdate:modelValue"> & TextareaProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        textareaRef: import("vue").Ref<HTMLTextAreaElement | null, HTMLTextAreaElement | null>;
    }>): void;
    attrs: any;
    slots: TextareaSlots;
    emit: ((evt: "blur", event: FocusEvent) => void) & ((evt: "change", event: Event) => void) & ((evt: "update:modelValue", payload: T) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
