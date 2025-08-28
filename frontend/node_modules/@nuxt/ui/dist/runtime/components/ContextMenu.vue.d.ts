import type { ContextMenuRootProps, ContextMenuRootEmits, ContextMenuContentProps, ContextMenuContentEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/context-menu';
import type { AvatarProps, KbdProps, LinkProps } from '../types';
import type { ArrayOrNested, DynamicSlots, MergeTypes, NestedItem, EmitsToProps, ComponentConfig } from '../types/utils';
type ContextMenu = ComponentConfig<typeof theme, AppConfig, 'contextMenu'>;
export interface ContextMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
    label?: string;
    /**
     * @IconifyIcon
     */
    icon?: string;
    color?: ContextMenu['variants']['color'];
    avatar?: AvatarProps;
    content?: Omit<ContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ContextMenuContentEmits>>;
    kbds?: KbdProps['value'][] | KbdProps[];
    /**
     * The item type.
     * @defaultValue 'link'
     */
    type?: 'label' | 'separator' | 'link' | 'checkbox';
    slot?: string;
    loading?: boolean;
    disabled?: boolean;
    checked?: boolean;
    open?: boolean;
    defaultOpen?: boolean;
    children?: ArrayOrNested<ContextMenuItem>;
    onSelect?(e: Event): void;
    onUpdateChecked?(checked: boolean): void;
    class?: any;
    ui?: Pick<ContextMenu['slots'], 'item' | 'label' | 'separator' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLabel' | 'itemLabelExternalIcon' | 'itemTrailing' | 'itemTrailingIcon' | 'itemTrailingKbds' | 'itemTrailingKbdsSize'>;
    [key: string]: any;
}
export interface ContextMenuProps<T extends ArrayOrNested<ContextMenuItem> = ArrayOrNested<ContextMenuItem>> extends Omit<ContextMenuRootProps, 'dir'> {
    /**
     * @defaultValue 'md'
     */
    size?: ContextMenu['variants']['size'];
    items?: T;
    /**
     * The icon displayed when an item is checked.
     * @defaultValue appConfig.ui.icons.check
     * @IconifyIcon
     */
    checkedIcon?: string;
    /**
     * The icon displayed when an item is loading.
     * @defaultValue appConfig.ui.icons.loading
     * @IconifyIcon
     */
    loadingIcon?: string;
    /**
     * The icon displayed when the item is an external link.
     * Set to `false` to hide the external icon.
     * @defaultValue appConfig.ui.icons.external
     * @IconifyIcon
     */
    externalIcon?: boolean | string;
    /** The content of the menu. */
    content?: Omit<ContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ContextMenuContentEmits>>;
    /**
     * Render the menu in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
    /**
     * The key used to get the label from the item.
     * @defaultValue 'label'
     */
    labelKey?: keyof NestedItem<T>;
    disabled?: boolean;
    class?: any;
    ui?: ContextMenu['slots'];
}
export interface ContextMenuEmits extends ContextMenuRootEmits {
}
type SlotProps<T extends ContextMenuItem> = (props: {
    item: T;
    active?: boolean;
    index: number;
}) => any;
export type ContextMenuSlots<A extends ArrayOrNested<ContextMenuItem> = ArrayOrNested<ContextMenuItem>, T extends NestedItem<A> = NestedItem<A>> = {
    'default'(props?: {}): any;
    'item': SlotProps<T>;
    'item-leading': SlotProps<T>;
    'item-label': SlotProps<T>;
    'item-trailing': SlotProps<T>;
    'content-top': (props?: {}) => any;
    'content-bottom': (props?: {}) => any;
} & DynamicSlots<MergeTypes<T>, 'leading' | 'label' | 'trailing', {
    active?: boolean;
    index: number;
}>;
declare const _default: <T extends ArrayOrNested<ContextMenuItem>>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onUpdate:open"?: ((payload: boolean) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onUpdate:open"> & ContextMenuProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: ContextMenuSlots<T, NestedItem<T>>;
    emit: (evt: "update:open", payload: boolean) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
