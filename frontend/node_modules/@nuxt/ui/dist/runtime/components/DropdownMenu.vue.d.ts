import type { DropdownMenuRootProps, DropdownMenuRootEmits, DropdownMenuContentProps, DropdownMenuContentEmits, DropdownMenuArrowProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/dropdown-menu';
import type { AvatarProps, KbdProps, LinkProps } from '../types';
import type { ArrayOrNested, DynamicSlots, MergeTypes, NestedItem, EmitsToProps, ComponentConfig } from '../types/utils';
type DropdownMenu = ComponentConfig<typeof theme, AppConfig, 'dropdownMenu'>;
export interface DropdownMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
    label?: string;
    /**
     * @IconifyIcon
     */
    icon?: string;
    color?: DropdownMenu['variants']['color'];
    avatar?: AvatarProps;
    content?: Omit<DropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DropdownMenuContentEmits>>;
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
    children?: ArrayOrNested<DropdownMenuItem>;
    onSelect?(e: Event): void;
    onUpdateChecked?(checked: boolean): void;
    class?: any;
    ui?: Pick<DropdownMenu['slots'], 'item' | 'label' | 'separator' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLabel' | 'itemLabelExternalIcon' | 'itemTrailing' | 'itemTrailingIcon' | 'itemTrailingKbds' | 'itemTrailingKbdsSize'>;
    [key: string]: any;
}
export interface DropdownMenuProps<T extends ArrayOrNested<DropdownMenuItem> = ArrayOrNested<DropdownMenuItem>> extends Omit<DropdownMenuRootProps, 'dir'> {
    /**
     * @defaultValue 'md'
     */
    size?: DropdownMenu['variants']['size'];
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
    /**
     * The content of the menu.
     * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8 }
     */
    content?: Omit<DropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DropdownMenuContentEmits>>;
    /**
     * Display an arrow alongside the menu.
     * @defaultValue false
     */
    arrow?: boolean | Omit<DropdownMenuArrowProps, 'as' | 'asChild'>;
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
    ui?: DropdownMenu['slots'];
}
export interface DropdownMenuEmits extends DropdownMenuRootEmits {
}
type SlotProps<T extends DropdownMenuItem> = (props: {
    item: T;
    active?: boolean;
    index: number;
}) => any;
export type DropdownMenuSlots<A extends ArrayOrNested<DropdownMenuItem> = ArrayOrNested<DropdownMenuItem>, T extends NestedItem<A> = NestedItem<A>> = {
    'default'(props: {
        open: boolean;
    }): any;
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
declare const _default: <T extends ArrayOrNested<DropdownMenuItem>>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onUpdate:open"?: ((payload: boolean) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onUpdate:open"> & DropdownMenuProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: DropdownMenuSlots<T, NestedItem<T>>;
    emit: (evt: "update:open", payload: boolean) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
