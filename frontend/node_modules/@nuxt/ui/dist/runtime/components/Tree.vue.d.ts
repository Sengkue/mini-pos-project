import type { TreeRootProps, TreeRootEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/tree';
import type { DynamicSlots, GetItemKeys, GetModelValue, GetModelValueEmits, NestedItem, ComponentConfig } from '../types/utils';
type Tree = ComponentConfig<typeof theme, AppConfig, 'tree'>;
export type TreeItem = {
    /**
     * @IconifyIcon
     */
    icon?: string;
    label?: string;
    /**
     * @IconifyIcon
     */
    trailingIcon?: string;
    defaultExpanded?: boolean;
    disabled?: boolean;
    value?: string;
    slot?: string;
    children?: TreeItem[];
    onToggle?(e: Event): void;
    onSelect?(e?: Event): void;
    class?: any;
    ui?: Pick<Tree['slots'], 'item' | 'itemWithChildren' | 'link' | 'linkLeadingIcon' | 'linkLabel' | 'linkTrailing' | 'linkTrailingIcon' | 'listWithChildren'>;
    [key: string]: any;
};
export interface TreeProps<T extends TreeItem[] = TreeItem[], VK extends GetItemKeys<T> = 'value', M extends boolean = false> extends Pick<TreeRootProps<T>, 'expanded' | 'defaultExpanded' | 'selectionBehavior' | 'propagateSelect' | 'disabled' | 'bubbleSelect'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'ul'
     */
    as?: any;
    /**
     * @defaultValue 'primary'
     */
    color?: Tree['variants']['color'];
    /**
     * @defaultValue 'md'
     */
    size?: Tree['variants']['size'];
    /**
     * The key used to get the value from the item.
     * @defaultValue 'value'
     */
    valueKey?: VK;
    /**
     * The key used to get the label from the item.
     * @defaultValue 'label'
     */
    labelKey?: keyof NestedItem<T>;
    /**
     * The icon displayed on the right side of a parent node.
     * @defaultValue appConfig.ui.icons.chevronDown
     * @IconifyIcon
     */
    trailingIcon?: string;
    /**
     * The icon displayed when a parent node is expanded.
     * @defaultValue appConfig.ui.icons.folderOpen
     * @IconifyIcon
     */
    expandedIcon?: string;
    /**
     * The icon displayed when a parent node is collapsed.
     * @defaultValue appConfig.ui.icons.folder
     * @IconifyIcon
     */
    collapsedIcon?: string;
    items?: T;
    /** The controlled value of the Tree. Can be bind as `v-model`. */
    modelValue?: GetModelValue<T, VK, M>;
    /** The value of the Tree when initially rendered. Use when you do not need to control the state of the Tree. */
    defaultValue?: GetModelValue<T, VK, M>;
    /** Whether multiple options can be selected or not. */
    multiple?: M & boolean;
    class?: any;
    ui?: Tree['slots'];
}
export type TreeEmits<A extends TreeItem[], VK extends GetItemKeys<A> | undefined, M extends boolean> = Omit<TreeRootEmits, 'update:modelValue'> & GetModelValueEmits<A, VK, M>;
type SlotProps<T extends TreeItem> = (props: {
    item: T;
    index: number;
    level: number;
    expanded: boolean;
    selected: boolean;
}) => any;
export type TreeSlots<A extends TreeItem[] = TreeItem[], T extends NestedItem<A> = NestedItem<A>> = {
    'item-wrapper': SlotProps<T>;
    'item': SlotProps<T>;
    'item-leading': SlotProps<T>;
    'item-label': SlotProps<T>;
    'item-trailing': SlotProps<T>;
} & DynamicSlots<T, undefined, {
    index: number;
    level: number;
    expanded: boolean;
    selected: boolean;
}>;
declare const _default: <T extends TreeItem[], VK extends GetItemKeys<T> = "value", M extends boolean = false>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onUpdate:modelValue"?: ((payload: GetModelValue<T, VK, M>) => any) | undefined;
        readonly "onUpdate:expanded"?: ((val: string[]) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onUpdate:modelValue" | "onUpdate:expanded"> & TreeProps<T, VK, M> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: TreeSlots<T, NestedItem<T>>;
    emit: ((evt: "update:modelValue", payload: GetModelValue<T, VK, M>) => void) & ((evt: "update:expanded", val: string[]) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
