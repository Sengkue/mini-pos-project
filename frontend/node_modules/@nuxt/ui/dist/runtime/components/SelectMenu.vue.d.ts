import type { ComboboxRootProps, ComboboxRootEmits, ComboboxContentProps, ComboboxContentEmits, ComboboxArrowProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/select-menu';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { AvatarProps, ChipProps, InputProps } from '../types';
import type { AcceptableValue, ArrayOrNested, GetItemKeys, GetModelValue, GetModelValueEmits, NestedItem, EmitsToProps, ComponentConfig } from '../types/utils';
type SelectMenu = ComponentConfig<typeof theme, AppConfig, 'selectMenu'>;
interface _SelectMenuItem {
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
    ui?: Pick<SelectMenu['slots'], 'label' | 'separator' | 'item' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLeadingChipSize' | 'itemLeadingChip' | 'itemLabel' | 'itemTrailing' | 'itemTrailingIcon'>;
    [key: string]: any;
}
export type SelectMenuItem = _SelectMenuItem | AcceptableValue | boolean;
export interface SelectMenuProps<T extends ArrayOrNested<SelectMenuItem> = ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false> extends Pick<ComboboxRootProps<T>, 'open' | 'defaultOpen' | 'disabled' | 'name' | 'resetSearchTermOnBlur' | 'resetSearchTermOnSelect' | 'highlightOnHover'>, UseComponentIconsProps {
    id?: string;
    /** The placeholder text when the select is empty. */
    placeholder?: string;
    /**
     * Whether to display the search input or not.
     * Can be an object to pass additional props to the input.
     * `{ placeholder: 'Search...', variant: 'none' }`{lang="ts-type"}
     * @defaultValue true
     */
    searchInput?: boolean | InputProps;
    /**
     * @defaultValue 'primary'
     */
    color?: SelectMenu['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: SelectMenu['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: SelectMenu['variants']['size'];
    required?: boolean;
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
    content?: Omit<ComboboxContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ComboboxContentEmits>>;
    /**
     * Display an arrow alongside the menu.
     * @defaultValue false
     * @IconifyIcon
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
    /** The value of the SelectMenu when initially rendered. Use when you do not need to control the state of the SelectMenu. */
    defaultValue?: GetModelValue<T, VK, M>;
    /** The controlled value of the SelectMenu. Can be binded-with with `v-model`. */
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
    autofocus?: boolean;
    autofocusDelay?: number;
    class?: any;
    ui?: SelectMenu['slots'];
}
export type SelectMenuEmits<A extends ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<A> | undefined, M extends boolean> = Pick<ComboboxRootEmits, 'update:open'> & {
    change: [payload: Event];
    blur: [payload: FocusEvent];
    focus: [payload: FocusEvent];
    create: [item: string];
    /** Event handler when highlighted element changes. */
    highlight: [
        payload: {
            ref: HTMLElement;
            value: GetModelValue<A, VK, M>;
        } | undefined
    ];
} & GetModelValueEmits<A, VK, M>;
type SlotProps<T extends SelectMenuItem> = (props: {
    item: T;
    index: number;
}) => any;
export interface SelectMenuSlots<A extends ArrayOrNested<SelectMenuItem> = ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<A> | undefined = undefined, M extends boolean = false, T extends NestedItem<A> = NestedItem<A>> {
    'leading'(props: {
        modelValue?: GetModelValue<A, VK, M>;
        open: boolean;
        ui: {
            [K in keyof Required<SelectMenu['slots']>]: (props?: Record<string, any>) => string;
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
            [K in keyof Required<SelectMenu['slots']>]: (props?: Record<string, any>) => string;
        };
    }): any;
    'empty'(props: {
        searchTerm?: string;
    }): any;
    'item': SlotProps<T>;
    'item-leading': SlotProps<T>;
    'item-label': SlotProps<T>;
    'item-trailing': SlotProps<T>;
    'content-top': (props?: {}) => any;
    'content-bottom': (props?: {}) => any;
    'create-item-label'(props: {
        item: string;
    }): any;
}
declare const _default: <T extends ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
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
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onFocus" | "onBlur" | "onChange" | "onUpdate:open" | "onUpdate:modelValue" | "onHighlight" | "onUpdate:searchTerm" | "onCreate"> & (SelectMenuProps<T, VK, M> & {
        searchTerm?: string;
    }) & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        triggerRef: import("vue").Ref<({
            $: import("vue").ComponentInternalInstance;
            $data: {};
            $props: {
                readonly disabled?: boolean | undefined;
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
            $options: import("vue").ComponentOptionsBase<Readonly<import("reka-ui").ComboboxTriggerProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
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
        }> & Omit<Readonly<import("reka-ui").ComboboxTriggerProps> & Readonly<{}>, "as"> & import("vue").ShallowUnwrapRef<{}> & {} & import("vue").ComponentCustomProperties & {} & {
            $slots: {
                default?: (props: {}) => any;
            };
        }) | null, ({
            $: import("vue").ComponentInternalInstance;
            $data: {};
            $props: {
                readonly disabled?: boolean | undefined;
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
            $options: import("vue").ComponentOptionsBase<Readonly<import("reka-ui").ComboboxTriggerProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
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
        }> & Omit<Readonly<import("reka-ui").ComboboxTriggerProps> & Readonly<{}>, "as"> & import("vue").ShallowUnwrapRef<{}> & {} & import("vue").ComponentCustomProperties & {} & {
            $slots: {
                default?: (props: {}) => any;
            };
        }) | null>;
    }>): void;
    attrs: any;
    slots: SelectMenuSlots<T, VK, M, NestedItem<T>>;
    emit: (((evt: "blur", payload: FocusEvent) => void) & ((evt: "change", payload: Event) => void) & ((evt: "focus", payload: FocusEvent) => void) & ((evt: "create", item: string) => void) & ((evt: "update:open", value: boolean) => void) & ((evt: "update:modelValue", payload: GetModelValue<T, VK, M>) => void) & ((evt: "highlight", payload: {
        ref: HTMLElement;
        value: GetModelValue<T, VK, M>;
    } | undefined) => void)) & ((evt: "update:searchTerm", value: string) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
