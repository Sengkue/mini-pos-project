import type { ComponentPublicInstance } from 'vue';
import type { TabsRootProps, TabsRootEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/tabs';
import type { AvatarProps, BadgeProps } from '../types';
import type { DynamicSlots, ComponentConfig } from '../types/utils';
type Tabs = ComponentConfig<typeof theme, AppConfig, 'tabs'>;
export interface TabsItem {
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
    slot?: string;
    content?: string;
    /** A unique value for the tab item. Defaults to the index. */
    value?: string | number;
    disabled?: boolean;
    class?: any;
    ui?: Pick<Tabs['slots'], 'trigger' | 'leadingIcon' | 'leadingAvatar' | 'leadingAvatarSize' | 'label' | 'trailingBadge' | 'trailingBadgeSize' | 'content'>;
    [key: string]: any;
}
export interface TabsProps<T extends TabsItem = TabsItem> extends Pick<TabsRootProps<string | number>, 'defaultValue' | 'modelValue' | 'activationMode' | 'unmountOnHide'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    items?: T[];
    /**
     * @defaultValue 'primary'
     */
    color?: Tabs['variants']['color'];
    /**
     * @defaultValue 'pill'
     */
    variant?: Tabs['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: Tabs['variants']['size'];
    /**
     * The orientation of the tabs.
     * @defaultValue 'horizontal'
     */
    orientation?: TabsRootProps['orientation'];
    /**
     * The content of the tabs, can be disabled to prevent rendering the content.
     * @defaultValue true
     */
    content?: boolean;
    /**
     * The key used to get the label from the item.
     * @defaultValue 'label'
     */
    labelKey?: string;
    class?: any;
    ui?: Tabs['slots'];
}
export interface TabsEmits extends TabsRootEmits<string | number> {
}
type SlotProps<T extends TabsItem> = (props: {
    item: T;
    index: number;
}) => any;
export type TabsSlots<T extends TabsItem = TabsItem> = {
    'leading': SlotProps<T>;
    'default': SlotProps<T>;
    'trailing': SlotProps<T>;
    'content': SlotProps<T>;
    'list-leading': (props?: {}) => any;
    'list-trailing': (props?: {}) => any;
} & DynamicSlots<T, undefined, {
    index: number;
}>;
declare const _default: <T extends TabsItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onUpdate:modelValue"?: ((payload: string | number) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onUpdate:modelValue"> & TabsProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        triggersRef: import("vue").Ref<ComponentPublicInstance[], ComponentPublicInstance[]>;
    }>): void;
    attrs: any;
    slots: TabsSlots<T>;
    emit: (evt: "update:modelValue", payload: string | number) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
