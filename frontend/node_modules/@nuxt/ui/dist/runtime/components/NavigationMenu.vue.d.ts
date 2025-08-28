import type { NavigationMenuRootProps, NavigationMenuRootEmits, NavigationMenuContentProps, NavigationMenuContentEmits, AccordionRootProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/navigation-menu';
import type { AvatarProps, BadgeProps, LinkProps, PopoverProps, TooltipProps } from '../types';
import type { ArrayOrNested, DynamicSlots, MergeTypes, NestedItem, EmitsToProps, ComponentConfig } from '../types/utils';
type NavigationMenu = ComponentConfig<typeof theme, AppConfig, 'navigationMenu'>;
export interface NavigationMenuChildItem extends Omit<NavigationMenuItem, 'type' | 'ui'> {
    /** Description is only used when `orientation` is `horizontal`. */
    description?: string;
    [key: string]: any;
}
export interface NavigationMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
    label?: string;
    /**
     * @IconifyIcon
     */
    icon?: string;
    avatar?: AvatarProps;
    /**
     * Display a badge on the item.
     * `{ size: 'sm', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
     */
    badge?: string | number | BadgeProps;
    /**
     * Display a tooltip on the item when the menu is collapsed with the label of the item.
     * This has priority over the global `tooltip` prop.
     */
    tooltip?: boolean | TooltipProps;
    /**
     * Display a popover on the item when the menu is collapsed with the children list.
     * This has priority over the global `popover` prop.
     */
    popover?: boolean | PopoverProps;
    /**
     * @IconifyIcon
     */
    trailingIcon?: string;
    /**
     * The type of the item.
     * The `label` type is only displayed in `vertical` orientation.
     * The `trigger` type is used to force the item to be collapsible when its a link in `vertical` orientation.
     * @defaultValue 'link'
     */
    type?: 'label' | 'trigger' | 'link';
    slot?: string;
    /**
     * The value of the item. Avoid using `index` as the value to prevent conflicts in horizontal orientation with Reka UI.
     * @defaultValue `item-${index}`
     */
    value?: string;
    children?: NavigationMenuChildItem[];
    defaultOpen?: boolean;
    open?: boolean;
    onSelect?(e: Event): void;
    class?: any;
    ui?: Pick<NavigationMenu['slots'], 'item' | 'linkLeadingAvatarSize' | 'linkLeadingAvatar' | 'linkLeadingIcon' | 'linkLabel' | 'linkLabelExternalIcon' | 'linkTrailing' | 'linkTrailingBadgeSize' | 'linkTrailingBadge' | 'linkTrailingIcon' | 'label' | 'link' | 'content' | 'childList' | 'childLabel' | 'childItem' | 'childLink' | 'childLinkIcon' | 'childLinkWrapper' | 'childLinkLabel' | 'childLinkLabelExternalIcon' | 'childLinkDescription'>;
    [key: string]: any;
}
export interface NavigationMenuProps<T extends ArrayOrNested<NavigationMenuItem> = ArrayOrNested<NavigationMenuItem>> extends Pick<NavigationMenuRootProps, 'modelValue' | 'defaultValue' | 'delayDuration' | 'disableClickTrigger' | 'disableHoverTrigger' | 'skipDelayDuration' | 'disablePointerLeaveClose' | 'unmountOnHide'>, Pick<AccordionRootProps, 'disabled' | 'type' | 'collapsible'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * The icon displayed to open the menu.
     * @defaultValue appConfig.ui.icons.chevronDown
     * @IconifyIcon
     */
    trailingIcon?: string;
    /**
     * The icon displayed when the item is an external link.
     * Set to `false` to hide the external icon.
     * @defaultValue appConfig.ui.icons.external
     * @IconifyIcon
     */
    externalIcon?: boolean | string;
    items?: T;
    /**
     * @defaultValue 'primary'
     */
    color?: NavigationMenu['variants']['color'];
    /**
     * @defaultValue 'pill'
     */
    variant?: NavigationMenu['variants']['variant'];
    /**
     * The orientation of the menu.
     * @defaultValue 'horizontal'
     */
    orientation?: NavigationMenuRootProps['orientation'];
    /**
     * Collapse the navigation menu to only show icons.
     * Only works when `orientation` is `vertical`.
     * @defaultValue false
     */
    collapsed?: boolean;
    /**
     * Display a tooltip on the items when the menu is collapsed with the label of the item.
     * `{ delayDuration: 0, content: { side: 'right' } }`{lang="ts-type"}
     * @defaultValue false
     */
    tooltip?: boolean | TooltipProps;
    /**
     * Display a popover on the items when the menu is collapsed with the children list.
     * `{ mode: 'hover', content: { side: 'right', align: 'start', alignOffset: 2 } }`{lang="ts-type"}
     * @defaultValue false
     */
    popover?: boolean | PopoverProps;
    /** Display a line next to the active item. */
    highlight?: boolean;
    /**
     * @defaultValue 'primary'
     */
    highlightColor?: NavigationMenu['variants']['highlightColor'];
    /** The content of the menu. */
    content?: Omit<NavigationMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<NavigationMenuContentEmits>>;
    /**
     * The orientation of the content.
     * Only works when `orientation` is `horizontal`.
     * @defaultValue 'horizontal'
     */
    contentOrientation?: NavigationMenu['variants']['contentOrientation'];
    /**
     * Display an arrow alongside the menu.
     * @defaultValue false
     */
    arrow?: boolean;
    /**
     * The key used to get the label from the item.
     * @defaultValue 'label'
     */
    labelKey?: keyof NestedItem<T>;
    class?: any;
    ui?: NavigationMenu['slots'];
}
export interface NavigationMenuEmits extends NavigationMenuRootEmits {
}
type SlotProps<T extends NavigationMenuItem> = (props: {
    item: T;
    index: number;
    active?: boolean;
}) => any;
export type NavigationMenuSlots<A extends ArrayOrNested<NavigationMenuItem> = ArrayOrNested<NavigationMenuItem>, T extends NestedItem<A> = NestedItem<A>> = {
    'item': SlotProps<T>;
    'item-leading': SlotProps<T>;
    'item-label': SlotProps<T>;
    'item-trailing': SlotProps<T>;
    'item-content': SlotProps<T>;
    'list-leading': (props?: {}) => any;
    'list-trailing': (props?: {}) => any;
} & DynamicSlots<MergeTypes<T>, 'leading' | 'label' | 'trailing' | 'content', {
    index: number;
    active?: boolean;
}>;
declare const _default: <T extends ArrayOrNested<NavigationMenuItem>>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onUpdate:modelValue"> & NavigationMenuProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: NavigationMenuSlots<T, NestedItem<T>>;
    emit: (evt: "update:modelValue", value: string) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
