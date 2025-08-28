import type { AppConfig } from '@nuxt/schema';
import type { TagsInputRootProps, TagsInputRootEmits, AcceptableInputValue } from 'reka-ui';
import theme from '#build/ui/input-tags';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { ComponentConfig } from '../types/utils';
type InputTags = ComponentConfig<typeof theme, AppConfig, 'inputTags'>;
export type InputTagItem = AcceptableInputValue;
export interface InputTagsProps<T extends InputTagItem = InputTagItem> extends Pick<TagsInputRootProps<T>, 'modelValue' | 'defaultValue' | 'addOnPaste' | 'addOnTab' | 'addOnBlur' | 'duplicate' | 'disabled' | 'delimiter' | 'max' | 'id' | 'convertValue' | 'displayValue' | 'name' | 'required'>, UseComponentIconsProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /** The placeholder text when the input is empty. */
    placeholder?: string;
    /** The maximum number of character allowed. */
    maxLength?: number;
    /**
     * @defaultValue 'primary'
     */
    color?: InputTags['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: InputTags['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: InputTags['variants']['size'];
    autofocus?: boolean;
    autofocusDelay?: number;
    /**
     * The icon displayed to delete a tag.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    deleteIcon?: string;
    /** Highlight the ring color like a focus state. */
    highlight?: boolean;
    class?: any;
    ui?: InputTags['slots'];
}
export interface InputTagsEmits<T extends InputTagItem> extends TagsInputRootEmits<T> {
    change: [event: Event];
    blur: [event: FocusEvent];
    focus: [event: FocusEvent];
}
type SlotProps<T extends InputTagItem> = (props: {
    item: T;
    index: number;
}) => any;
export interface InputTagsSlots<T extends InputTagItem = InputTagItem> {
    'leading'(props?: {}): any;
    'default'(props?: {}): any;
    'trailing'(props?: {}): any;
    'item-text': SlotProps<T>;
    'item-delete': SlotProps<T>;
}
declare const _default: <T extends InputTagItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onBlur?: ((event: FocusEvent) => any) | undefined;
        readonly onChange?: ((event: Event) => any) | undefined;
        readonly onFocus?: ((event: FocusEvent) => any) | undefined;
        readonly onInvalid?: ((payload: T) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((payload: T[]) => any) | undefined;
        readonly onAddTag?: ((payload: T) => any) | undefined;
        readonly onRemoveTag?: ((payload: T) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onFocus" | "onBlur" | "onChange" | "onInvalid" | "onUpdate:modelValue" | "onRemoveTag" | "onAddTag"> & InputTagsProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        inputRef: import("vue").Ref<({
            $: import("vue").ComponentInternalInstance;
            $data: {};
            $props: {
                readonly placeholder?: string | undefined;
                readonly autoFocus?: boolean | undefined;
                readonly maxLength?: number | undefined;
                readonly asChild?: boolean | undefined;
                readonly as?: (import("reka-ui").AsTag | import("vue").Component) | undefined;
            } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps;
            $attrs: {
                [x: string]: unknown;
            };
            $refs: {
                [x: string]: unknown;
            };
            $slots: Readonly<{
                [name: string]: import("vue").Slot<any> | undefined;
            }>;
            $root: import("vue").ComponentPublicInstance | null;
            $parent: import("vue").ComponentPublicInstance | null;
            $host: Element | null;
            $emit: (event: string, ...args: any[]) => void;
            $el: any;
            $options: import("vue").ComponentOptionsBase<Readonly<import("reka-ui").TagsInputInputProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
                as: import("reka-ui").AsTag | import("vue").Component;
            }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & {
                beforeCreate?: (() => void) | (() => void)[];
                created?: (() => void) | (() => void)[];
                beforeMount?: (() => void) | (() => void)[];
                mounted?: (() => void) | (() => void)[];
                beforeUpdate?: (() => void) | (() => void)[];
                updated?: (() => void) | (() => void)[];
                activated?: (() => void) | (() => void)[];
                deactivated?: (() => void) | (() => void)[];
                beforeDestroy?: (() => void) | (() => void)[];
                beforeUnmount?: (() => void) | (() => void)[];
                destroyed?: (() => void) | (() => void)[];
                unmounted?: (() => void) | (() => void)[];
                renderTracked?: ((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[];
                renderTriggered?: ((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[];
                errorCaptured?: ((err: unknown, instance: import("vue").ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import("vue").ComponentPublicInstance | null, info: string) => boolean | void)[];
            };
            $forceUpdate: () => void;
            $nextTick: typeof import("vue").nextTick;
            $watch<T_1 extends string | ((...args: any) => any)>(source: T_1, cb: T_1 extends (...args: any) => infer R ? (...args: [R, R, import("@vue/reactivity").OnCleanup]) => any : (...args: [any, any, import("@vue/reactivity").OnCleanup]) => any, options?: import("vue").WatchOptions): import("vue").WatchStopHandle;
        } & Readonly<{
            as: import("reka-ui").AsTag | import("vue").Component;
        }> & Omit<Readonly<import("reka-ui").TagsInputInputProps> & Readonly<{}>, "as"> & import("vue").ShallowUnwrapRef<{}> & {} & import("vue").ComponentCustomProperties & {} & {
            $slots: {
                default?: (props: {}) => any;
            };
        }) | null, ({
            $: import("vue").ComponentInternalInstance;
            $data: {};
            $props: {
                readonly placeholder?: string | undefined;
                readonly autoFocus?: boolean | undefined;
                readonly maxLength?: number | undefined;
                readonly asChild?: boolean | undefined;
                readonly as?: (import("reka-ui").AsTag | import("vue").Component) | undefined;
            } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps;
            $attrs: {
                [x: string]: unknown;
            };
            $refs: {
                [x: string]: unknown;
            };
            $slots: Readonly<{
                [name: string]: import("vue").Slot<any> | undefined;
            }>;
            $root: import("vue").ComponentPublicInstance | null;
            $parent: import("vue").ComponentPublicInstance | null;
            $host: Element | null;
            $emit: (event: string, ...args: any[]) => void;
            $el: any;
            $options: import("vue").ComponentOptionsBase<Readonly<import("reka-ui").TagsInputInputProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
                as: import("reka-ui").AsTag | import("vue").Component;
            }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & {
                beforeCreate?: (() => void) | (() => void)[];
                created?: (() => void) | (() => void)[];
                beforeMount?: (() => void) | (() => void)[];
                mounted?: (() => void) | (() => void)[];
                beforeUpdate?: (() => void) | (() => void)[];
                updated?: (() => void) | (() => void)[];
                activated?: (() => void) | (() => void)[];
                deactivated?: (() => void) | (() => void)[];
                beforeDestroy?: (() => void) | (() => void)[];
                beforeUnmount?: (() => void) | (() => void)[];
                destroyed?: (() => void) | (() => void)[];
                unmounted?: (() => void) | (() => void)[];
                renderTracked?: ((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[];
                renderTriggered?: ((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[];
                errorCaptured?: ((err: unknown, instance: import("vue").ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import("vue").ComponentPublicInstance | null, info: string) => boolean | void)[];
            };
            $forceUpdate: () => void;
            $nextTick: typeof import("vue").nextTick;
            $watch<T_1 extends string | ((...args: any) => any)>(source: T_1, cb: T_1 extends (...args: any) => infer R ? (...args: [R, R, import("@vue/reactivity").OnCleanup]) => any : (...args: [any, any, import("@vue/reactivity").OnCleanup]) => any, options?: import("vue").WatchOptions): import("vue").WatchStopHandle;
        } & Readonly<{
            as: import("reka-ui").AsTag | import("vue").Component;
        }> & Omit<Readonly<import("reka-ui").TagsInputInputProps> & Readonly<{}>, "as"> & import("vue").ShallowUnwrapRef<{}> & {} & import("vue").ComponentCustomProperties & {} & {
            $slots: {
                default?: (props: {}) => any;
            };
        }) | null>;
    }>): void;
    attrs: any;
    slots: InputTagsSlots<T>;
    emit: ((evt: "blur", event: FocusEvent) => void) & ((evt: "change", event: Event) => void) & ((evt: "focus", event: FocusEvent) => void) & ((evt: "invalid", payload: T) => void) & ((evt: "update:modelValue", payload: T[]) => void) & ((evt: "addTag", payload: T) => void) & ((evt: "removeTag", payload: T) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
