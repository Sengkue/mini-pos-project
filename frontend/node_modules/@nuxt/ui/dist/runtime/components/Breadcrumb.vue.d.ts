import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/breadcrumb';
import type { AvatarProps, LinkProps } from '../types';
import type { DynamicSlots, ComponentConfig } from '../types/utils';
type Breadcrumb = ComponentConfig<typeof theme, AppConfig, 'breadcrumb'>;
export interface BreadcrumbItem extends Omit<LinkProps, 'raw' | 'custom'> {
    label?: string;
    /**
     * @IconifyIcon
     */
    icon?: string;
    avatar?: AvatarProps;
    slot?: string;
    class?: any;
    ui?: Pick<Breadcrumb['slots'], 'item' | 'link' | 'linkLeadingIcon' | 'linkLeadingAvatar' | 'linkLabel' | 'separator' | 'separatorIcon'>;
    [key: string]: any;
}
export interface BreadcrumbProps<T extends BreadcrumbItem = BreadcrumbItem> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'nav'
     */
    as?: any;
    items?: T[];
    /**
     * The icon to use as a separator.
     * @defaultValue appConfig.ui.icons.chevronRight
     * @IconifyIcon
     */
    separatorIcon?: string;
    /**
     * The key used to get the label from the item.
     * @defaultValue 'label'
     */
    labelKey?: string;
    class?: any;
    ui?: Breadcrumb['slots'];
}
type SlotProps<T extends BreadcrumbItem> = (props: {
    item: T;
    index: number;
    active?: boolean;
}) => any;
export type BreadcrumbSlots<T extends BreadcrumbItem = BreadcrumbItem> = {
    'item': SlotProps<T>;
    'item-leading': SlotProps<T>;
    'item-label': SlotProps<T>;
    'item-trailing': SlotProps<T>;
    'separator': any;
} & DynamicSlots<T, 'leading' | 'label' | 'trailing', {
    index: number;
    active?: boolean;
}>;
declare const _default: <T extends BreadcrumbItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{} & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, never> & BreadcrumbProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: BreadcrumbSlots<T>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
