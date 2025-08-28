import type { NumberFieldRootProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/input-number';
import type { ButtonProps } from '../types';
import type { ComponentConfig } from '../types/utils';
type InputNumber = ComponentConfig<typeof theme, AppConfig, 'inputNumber'>;
export interface InputNumberProps extends Pick<NumberFieldRootProps, 'modelValue' | 'defaultValue' | 'min' | 'max' | 'step' | 'stepSnapping' | 'disabled' | 'required' | 'id' | 'name' | 'formatOptions' | 'disableWheelChange' | 'invertWheelChange' | 'readonly'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /** The placeholder text when the input is empty. */
    placeholder?: string;
    color?: InputNumber['variants']['color'];
    variant?: InputNumber['variants']['variant'];
    size?: InputNumber['variants']['size'];
    /** Highlight the ring color like a focus state. */
    highlight?: boolean;
    /**
     * The orientation of the input menu.
     * @defaultValue 'horizontal'
     */
    orientation?: 'vertical' | 'horizontal';
    /**
     * Configure the increment button. The `color` and `size` are inherited.
     * @defaultValue { variant: 'link' }
     */
    increment?: ButtonProps;
    /**
     * The icon displayed to increment the value.
     * @defaultValue appConfig.ui.icons.plus
     * @IconifyIcon
     */
    incrementIcon?: string;
    /** Disable the increment button. */
    incrementDisabled?: boolean;
    /**
     * Configure the decrement button. The `color` and `size` are inherited.
     * @defaultValue { variant: 'link' }
     */
    decrement?: ButtonProps;
    /**
     * The icon displayed to decrement the value.
     * @defaultValue appConfig.ui.icons.minus
     * @IconifyIcon
     */
    decrementIcon?: string;
    /** Disable the decrement button. */
    decrementDisabled?: boolean;
    autofocus?: boolean;
    autofocusDelay?: number;
    /**
     * The locale to use for formatting and parsing numbers.
     * @defaultValue UApp.locale.code
     */
    locale?: string;
    class?: any;
    ui?: InputNumber['slots'];
}
export interface InputNumberEmits {
    'update:modelValue': [payload: number];
    'blur': [event: FocusEvent];
    'change': [payload: Event];
}
export interface InputNumberSlots {
    increment(props?: {}): any;
    decrement(props?: {}): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<InputNumberProps, {
    inputRef: import("vue").Ref<({
        $: import("vue").ComponentInternalInstance;
        $data: {};
        $props: {
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
        $options: import("vue").ComponentOptionsBase<Readonly<import("reka-ui").NumberFieldInputProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
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
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import("@vue/reactivity").OnCleanup]) => any : (...args: [any, any, import("@vue/reactivity").OnCleanup]) => any, options?: import("vue").WatchOptions): import("vue").WatchStopHandle;
    } & Readonly<{
        as: import("reka-ui").AsTag | import("vue").Component;
    }> & Omit<Readonly<import("reka-ui").NumberFieldInputProps> & Readonly<{}>, "as"> & import("vue").ShallowUnwrapRef<{}> & {} & import("vue").ComponentCustomProperties & {} & {
        $slots: {
            default?: (props: {}) => any;
        };
    }) | null, ({
        $: import("vue").ComponentInternalInstance;
        $data: {};
        $props: {
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
        $options: import("vue").ComponentOptionsBase<Readonly<import("reka-ui").NumberFieldInputProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
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
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import("@vue/reactivity").OnCleanup]) => any : (...args: [any, any, import("@vue/reactivity").OnCleanup]) => any, options?: import("vue").WatchOptions): import("vue").WatchStopHandle;
    } & Readonly<{
        as: import("reka-ui").AsTag | import("vue").Component;
    }> & Omit<Readonly<import("reka-ui").NumberFieldInputProps> & Readonly<{}>, "as"> & import("vue").ShallowUnwrapRef<{}> & {} & import("vue").ComponentCustomProperties & {} & {
        $slots: {
            default?: (props: {}) => any;
        };
    }) | null>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    blur: (event: FocusEvent) => any;
    change: (payload: Event) => any;
    "update:modelValue": (payload: number) => any;
}, string, import("vue").PublicProps, Readonly<InputNumberProps> & Readonly<{
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((payload: Event) => any) | undefined;
    "onUpdate:modelValue"?: ((payload: number) => any) | undefined;
}>, {
    orientation: "vertical" | "horizontal";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, InputNumberSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
