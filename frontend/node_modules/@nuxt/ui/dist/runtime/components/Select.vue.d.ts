import type { SelectRootProps, SelectRootEmits, SelectContentProps, SelectContentEmits, SelectArrowProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/select';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { AvatarProps, ChipProps } from '../types';
import type { AcceptableValue, ArrayOrNested, GetItemKeys, GetModelValue, GetModelValueEmits, NestedItem, EmitsToProps, ComponentConfig } from '../types/utils';
type Select = ComponentConfig<typeof theme, AppConfig, 'select'>;
interface SelectItemBase {
    label?: string;
    /**
     * @IconifyIcon
     */
    icon?: string;
    avatar?: AvatarProps;
    chip?: ChipProps;
    /**
     * The item type.
     * @defaultValue 'item'
     */
    type?: 'label' | 'separator' | 'item';
    value?: AcceptableValue | boolean;
    disabled?: boolean;
    onSelect?(e?: Event): void;
    class?: any;
    ui?: Pick<Select['slots'], 'label' | 'separator' | 'item' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLeadingChipSize' | 'itemLeadingChip' | 'itemLabel' | 'itemTrailing' | 'itemTrailingIcon'>;
    [key: string]: any;
}
export type SelectItem = SelectItemBase | AcceptableValue | boolean;
export interface SelectProps<T extends ArrayOrNested<SelectItem> = ArrayOrNested<SelectItem>, VK extends GetItemKeys<T> = 'value', M extends boolean = false> extends Omit<SelectRootProps<T>, 'dir' | 'multiple' | 'modelValue' | 'defaultValue' | 'by'>, UseComponentIconsProps {
    id?: string;
    /** The placeholder text when the select is empty. */
    placeholder?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: Select['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: Select['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: Select['variants']['size'];
    /**
     * The icon displayed to open the menu.
     * @defaultValue appConfig.ui.icons.chevronDown
     * @IconifyIcon
     */
    trailingIcon?: string;
    /**
     * The icon displayed when an item is selected.
     * @defaultValue appConfig.ui.icons.check
     * @IconifyIcon
     */
    selectedIcon?: string;
    /**
     * The content of the menu.
     * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }
     */
    content?: Omit<SelectContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<SelectContentEmits>>;
    /**
     * Display an arrow alongside the menu.
     * @defaultValue false
     */
    arrow?: boolean | Omit<SelectArrowProps, 'as' | 'asChild'>;
    /**
     * Render the menu in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
    /**
     * When `items` is an array of objects, select the field to use as the value.
     * @defaultValue 'value'
     */
    valueKey?: VK;
    /**
     * When `items` is an array of objects, select the field to use as the label.
     * @defaultValue 'label'
     */
    labelKey?: keyof NestedItem<T>;
    items?: T;
    /** The value of the Select when initially rendered. Use when you do not need to control the state of the Select. */
    defaultValue?: GetModelValue<T, VK, M>;
    /** The controlled value of the Select. Can be bind as `v-model`. */
    modelValue?: GetModelValue<T, VK, M>;
    /** Whether multiple options can be selected or not. */
    multiple?: M & boolean;
    /** Highlight the ring color like a focus state. */
    highlight?: boolean;
    autofocus?: boolean;
    autofocusDelay?: number;
    class?: any;
    ui?: Select['slots'];
}
export type SelectEmits<A extends ArrayOrNested<SelectItem>, VK extends GetItemKeys<A> | undefined, M extends boolean> = Omit<SelectRootEmits, 'update:modelValue'> & {
    change: [payload: Event];
    blur: [payload: FocusEvent];
    focus: [payload: FocusEvent];
} & GetModelValueEmits<A, VK, M>;
type SlotProps<T extends SelectItem> = (props: {
    item: T;
    index: number;
}) => any;
export interface SelectSlots<A extends ArrayOrNested<SelectItem> = ArrayOrNested<SelectItem>, VK extends GetItemKeys<A> | undefined = undefined, M extends boolean = false, T extends NestedItem<A> = NestedItem<A>> {
    'leading'(props: {
        modelValue?: GetModelValue<A, VK, M>;
        open: boolean;
        ui: {
            [K in keyof Required<Select['slots']>]: (props?: Record<string, any>) => string;
        };
    }): any;
    'default'(props: {
        modelValue?: GetModelValue<A, VK, M>;
        open: boolean;
    }): any;
    'trailing'(props: {
        modelValue?: GetModelValue<A, VK, M>;
        open: boolean;
        ui: {
            [K in keyof Required<Select['slots']>]: (props?: Record<string, any>) => string;
        };
    }): any;
    'item': SlotProps<T>;
    'item-leading': SlotProps<T>;
    'item-label': SlotProps<T>;
    'item-trailing': SlotProps<T>;
    'content-top': (props?: {}) => any;
    'content-bottom': (props?: {}) => any;
}
declare const _default: <T extends ArrayOrNested<SelectItem>, VK extends GetItemKeys<T> = "value", M extends boolean = false>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onBlur?: ((payload: FocusEvent) => any) | undefined;
        readonly onChange?: ((payload: Event) => any) | undefined;
        readonly onFocus?: ((payload: FocusEvent) => any) | undefined;
        readonly "onUpdate:open"?: ((value: boolean) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((payload: GetModelValue<T, VK, M>) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onFocus" | "onBlur" | "onChange" | "onUpdate:open" | "onUpdate:modelValue"> & SelectProps<T, VK, M> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        triggerRef: import("vue").Ref<({
            $: import("vue").ComponentInternalInstance;
            $data: {};
            $props: {
                readonly disabled?: boolean | undefined;
                readonly reference?: import("reka-ui").ReferenceElement | undefined;
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
            $options: import("vue").ComponentOptionsBase<Readonly<import("reka-ui").SelectTriggerProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
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
        }> & Omit<Readonly<import("reka-ui").SelectTriggerProps> & Readonly<{}>, "as"> & import("vue").ShallowUnwrapRef<{}> & {} & import("vue").ComponentCustomProperties & {} & {
            $slots: {
                default?: (props: {}) => any;
            };
        }) | null, ({
            $: import("vue").ComponentInternalInstance;
            $data: {};
            $props: {
                readonly disabled?: boolean | undefined;
                readonly reference?: import("reka-ui").ReferenceElement | undefined;
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
            $options: import("vue").ComponentOptionsBase<Readonly<import("reka-ui").SelectTriggerProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
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
        }> & Omit<Readonly<import("reka-ui").SelectTriggerProps> & Readonly<{}>, "as"> & import("vue").ShallowUnwrapRef<{}> & {} & import("vue").ComponentCustomProperties & {} & {
            $slots: {
                default?: (props: {}) => any;
            };
        }) | null>;
    }>): void;
    attrs: any;
    slots: SelectSlots<T, VK, M, NestedItem<T>>;
    emit: ((evt: "blur", payload: FocusEvent) => void) & ((evt: "change", payload: Event) => void) & ((evt: "focus", payload: FocusEvent) => void) & ((evt: "update:open", value: boolean) => void) & ((evt: "update:modelValue", payload: GetModelValue<T, VK, M>) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
