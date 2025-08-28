import { nextTick } from 'vue';
import type { InputHTMLAttributes } from 'vue';
import type { ComboboxRootProps, ComboboxRootEmits, ComboboxContentProps, ComboboxContentEmits, ComboboxArrowProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/input-menu';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { AvatarProps, ChipProps } from '../types';
import type { AcceptableValue, ArrayOrNested, GetItemKeys, GetModelValue, GetModelValueEmits, NestedItem, EmitsToProps, ComponentConfig } from '../types/utils';
type InputMenu = ComponentConfig<typeof theme, AppConfig, 'inputMenu'>;
interface _InputMenuItem {
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
    disabled?: boolean;
    onSelect?(e?: Event): void;
    class?: any;
    ui?: Pick<InputMenu['slots'], 'tagsItem' | 'tagsItemText' | 'tagsItemDelete' | 'tagsItemDeleteIcon' | 'label' | 'separator' | 'item' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLeadingChip' | 'itemLeadingChipSize' | 'itemLabel' | 'itemTrailing' | 'itemTrailingIcon'>;
    [key: string]: any;
}
export type InputMenuItem = _InputMenuItem | AcceptableValue | boolean;
export interface InputMenuProps<T extends ArrayOrNested<InputMenuItem> = ArrayOrNested<InputMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false> extends Pick<ComboboxRootProps<T>, 'open' | 'defaultOpen' | 'disabled' | 'name' | 'resetSearchTermOnBlur' | 'resetSearchTermOnSelect' | 'highlightOnHover' | 'openOnClick' | 'openOnFocus'>, UseComponentIconsProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    id?: string;
    type?: InputHTMLAttributes['type'];
    /** The placeholder text when the input is empty. */
    placeholder?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: InputMenu['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: InputMenu['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: InputMenu['variants']['size'];
    required?: boolean;
    autofocus?: boolean;
    autofocusDelay?: number;
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
     * The icon displayed to delete a tag.
     * Works only when `multiple` is `true`.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    deleteIcon?: string;
    /**
     * The content of the menu.
     * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }
     */
    content?: Omit<ComboboxContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ComboboxContentEmits>>;
    /**
     * Display an arrow alongside the menu.
     * @defaultValue false
     */
    arrow?: boolean | Omit<ComboboxArrowProps, 'as' | 'asChild'>;
    /**
     * Render the menu in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
    /**
     * When `items` is an array of objects, select the field to use as the value instead of the object itself.
     * @defaultValue undefined
     */
    valueKey?: VK;
    /**
     * When `items` is an array of objects, select the field to use as the label.
     * @defaultValue 'label'
     */
    labelKey?: keyof NestedItem<T>;
    items?: T;
    /** The value of the InputMenu when initially rendered. Use when you do not need to control the state of the InputMenu. */
    defaultValue?: GetModelValue<T, VK, M>;
    /** The controlled value of the InputMenu. Can be binded-with with `v-model`. */
    modelValue?: GetModelValue<T, VK, M>;
    /** Whether multiple options can be selected or not. */
    multiple?: M & boolean;
    /** Highlight the ring color like a focus state. */
    highlight?: boolean;
    /**
     * Determines if custom user input that does not exist in options can be added.
     * @defaultValue false
     */
    createItem?: boolean | 'always' | {
        position?: 'top' | 'bottom';
        when?: 'empty' | 'always';
    };
    /**
     * Fields to filter items by.
     * @defaultValue [labelKey]
     */
    filterFields?: string[];
    /**
     * When `true`, disable the default filters, useful for custom filtering (useAsyncData, useFetch, etc.).
     * @defaultValue false
     */
    ignoreFilter?: boolean;
    class?: any;
    ui?: InputMenu['slots'];
}
export type InputMenuEmits<A extends ArrayOrNested<InputMenuItem>, VK extends GetItemKeys<A> | undefined, M extends boolean> = Pick<ComboboxRootEmits, 'update:open'> & {
    'change': [payload: Event];
    'blur': [payload: FocusEvent];
    'focus': [payload: FocusEvent];
    'create': [item: string];
    /** Event handler when highlighted element changes. */
    'highlight': [
        payload: {
            ref: HTMLElement;
            value: GetModelValue<A, VK, M>;
        } | undefined
    ];
    'remove-tag': [item: GetModelValue<A, VK, M>];
} & GetModelValueEmits<A, VK, M>;
type SlotProps<T extends InputMenuItem> = (props: {
    item: T;
    index: number;
}) => any;
export interface InputMenuSlots<A extends ArrayOrNested<InputMenuItem> = ArrayOrNested<InputMenuItem>, VK extends GetItemKeys<A> | undefined = undefined, M extends boolean = false, T extends NestedItem<A> = NestedItem<A>> {
    'leading'(props: {
        modelValue?: GetModelValue<A, VK, M>;
        open: boolean;
        ui: {
            [K in keyof Required<InputMenu['slots']>]: (props?: Record<string, any>) => string;
        };
    }): any;
    'trailing'(props: {
        modelValue?: GetModelValue<A, VK, M>;
        open: boolean;
        ui: {
            [K in keyof Required<InputMenu['slots']>]: (props?: Record<string, any>) => string;
        };
    }): any;
    'empty'(props: {
        searchTerm?: string;
    }): any;
    'item': SlotProps<T>;
    'item-leading': SlotProps<T>;
    'item-label': SlotProps<T>;
    'item-trailing': SlotProps<T>;
    'tags-item-text': SlotProps<T>;
    'tags-item-delete': SlotProps<T>;
    'content-top': (props?: {}) => any;
    'content-bottom': (props?: {}) => any;
    'create-item-label'(props: {
        item: string;
    }): any;
}
declare const _default: <T extends ArrayOrNested<InputMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onBlur?: ((payload: FocusEvent) => any) | undefined;
        readonly onChange?: ((payload: Event) => any) | undefined;
        readonly onFocus?: ((payload: FocusEvent) => any) | undefined;
        readonly onCreate?: ((item: string) => any) | undefined;
        readonly "onUpdate:open"?: ((value: boolean) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((payload: GetModelValue<T, VK, M>) => any) | undefined;
        readonly onHighlight?: ((payload: {
            ref: HTMLElement;
            value: GetModelValue<T, VK, M>;
        } | undefined) => any) | undefined;
        readonly "onUpdate:searchTerm"?: ((value: string) => any) | undefined;
        readonly "onRemove-tag"?: ((item: GetModelValue<T, VK, M>) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onFocus" | "onBlur" | "onChange" | "onUpdate:open" | "onUpdate:modelValue" | "onHighlight" | "onUpdate:searchTerm" | "onCreate" | "onRemove-tag"> & (InputMenuProps<T, VK, M> & {
        searchTerm?: string;
    }) & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        inputRef: import("vue").Ref<({
            $: import("vue").ComponentInternalInstance;
            $data: {};
            $props: {
                readonly displayValue?: ((val: any) => string) | undefined;
                readonly modelValue?: string | undefined;
                readonly autoFocus?: boolean | undefined;
                readonly disabled?: boolean | undefined;
                readonly asChild?: boolean | undefined;
                readonly as?: (import("reka-ui").AsTag | import("vue").Component) | undefined;
                readonly "onUpdate:modelValue"?: ((args_0: string) => any) | undefined | undefined;
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
            $emit: (event: "update:modelValue", args_0: string) => void;
            $el: any;
            $options: import("vue").ComponentOptionsBase<Readonly<import("reka-ui").ComboboxInputProps> & Readonly<{
                "onUpdate:modelValue"?: ((args_0: string) => any) | undefined;
            }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
                "update:modelValue": (args_0: string) => any;
            }, string, {
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
            $nextTick: typeof nextTick;
            $watch<T_1 extends string | ((...args: any) => any)>(source: T_1, cb: T_1 extends (...args: any) => infer R ? (...args: [R, R, import("@vue/reactivity").OnCleanup]) => any : (...args: [any, any, import("@vue/reactivity").OnCleanup]) => any, options?: import("vue").WatchOptions): import("vue").WatchStopHandle;
        } & Readonly<{
            as: import("reka-ui").AsTag | import("vue").Component;
        }> & Omit<Readonly<import("reka-ui").ComboboxInputProps> & Readonly<{
            "onUpdate:modelValue"?: ((args_0: string) => any) | undefined;
        }>, "as"> & import("vue").ShallowUnwrapRef<{}> & {} & import("vue").ComponentCustomProperties & {} & {
            $slots: {
                default?: (props: {}) => any;
            };
        }) | null, ({
            $: import("vue").ComponentInternalInstance;
            $data: {};
            $props: {
                readonly displayValue?: ((val: any) => string) | undefined;
                readonly modelValue?: string | undefined;
                readonly autoFocus?: boolean | undefined;
                readonly disabled?: boolean | undefined;
                readonly asChild?: boolean | undefined;
                readonly as?: (import("reka-ui").AsTag | import("vue").Component) | undefined;
                readonly "onUpdate:modelValue"?: ((args_0: string) => any) | undefined | undefined;
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
            $emit: (event: "update:modelValue", args_0: string) => void;
            $el: any;
            $options: import("vue").ComponentOptionsBase<Readonly<import("reka-ui").ComboboxInputProps> & Readonly<{
                "onUpdate:modelValue"?: ((args_0: string) => any) | undefined;
            }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
                "update:modelValue": (args_0: string) => any;
            }, string, {
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
            $nextTick: typeof nextTick;
            $watch<T_1 extends string | ((...args: any) => any)>(source: T_1, cb: T_1 extends (...args: any) => infer R ? (...args: [R, R, import("@vue/reactivity").OnCleanup]) => any : (...args: [any, any, import("@vue/reactivity").OnCleanup]) => any, options?: import("vue").WatchOptions): import("vue").WatchStopHandle;
        } & Readonly<{
            as: import("reka-ui").AsTag | import("vue").Component;
        }> & Omit<Readonly<import("reka-ui").ComboboxInputProps> & Readonly<{
            "onUpdate:modelValue"?: ((args_0: string) => any) | undefined;
        }>, "as"> & import("vue").ShallowUnwrapRef<{}> & {} & import("vue").ComponentCustomProperties & {} & {
            $slots: {
                default?: (props: {}) => any;
            };
        }) | null>;
    }>): void;
    attrs: any;
    slots: InputMenuSlots<T, VK, M, NestedItem<T>>;
    emit: (((evt: "blur", payload: FocusEvent) => void) & ((evt: "change", payload: Event) => void) & ((evt: "focus", payload: FocusEvent) => void) & ((evt: "create", item: string) => void) & ((evt: "update:open", value: boolean) => void) & ((evt: "update:modelValue", payload: GetModelValue<T, VK, M>) => void) & ((evt: "highlight", payload: {
        ref: HTMLElement;
        value: GetModelValue<T, VK, M>;
    } | undefined) => void) & ((evt: "remove-tag", item: GetModelValue<T, VK, M>) => void)) & ((evt: "update:searchTerm", value: string) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
