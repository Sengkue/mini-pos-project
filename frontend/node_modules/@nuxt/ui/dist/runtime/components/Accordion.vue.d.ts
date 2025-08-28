import type { AccordionRootProps, AccordionRootEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/accordion';
import type { DynamicSlots, ComponentConfig } from '../types/utils';
type Accordion = ComponentConfig<typeof theme, AppConfig, 'accordion'>;
export interface AccordionItem {
    label?: string;
    /**
     * @IconifyIcon
     */
    icon?: string;
    /**
     * @IconifyIcon
     */
    trailingIcon?: string;
    slot?: string;
    content?: string;
    /** A unique value for the accordion item. Defaults to the index. */
    value?: string;
    disabled?: boolean;
    class?: any;
    ui?: Pick<Accordion['slots'], 'item' | 'header' | 'trigger' | 'leadingIcon' | 'label' | 'trailingIcon' | 'content' | 'body'>;
    [key: string]: any;
}
export interface AccordionProps<T extends AccordionItem = AccordionItem> extends Pick<AccordionRootProps, 'collapsible' | 'defaultValue' | 'modelValue' | 'type' | 'disabled' | 'unmountOnHide'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    items?: T[];
    /**
     * The icon displayed on the right side of the trigger.
     * @defaultValue appConfig.ui.icons.chevronDown
     * @IconifyIcon
     */
    trailingIcon?: string;
    /**
     * The key used to get the label from the item.
     * @defaultValue 'label'
     */
    labelKey?: string;
    class?: any;
    ui?: Accordion['slots'];
}
export interface AccordionEmits extends AccordionRootEmits {
}
type SlotProps<T extends AccordionItem> = (props: {
    item: T;
    index: number;
    open: boolean;
}) => any;
export type AccordionSlots<T extends AccordionItem = AccordionItem> = {
    leading: SlotProps<T>;
    default: SlotProps<T>;
    trailing: SlotProps<T>;
    content: SlotProps<T>;
    body: SlotProps<T>;
} & DynamicSlots<T, 'body', {
    index: number;
    open: boolean;
}>;
declare const _default: <T extends AccordionItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onUpdate:modelValue"?: ((value: string | string[] | undefined) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onUpdate:modelValue"> & AccordionProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: AccordionSlots<T>;
    emit: (evt: "update:modelValue", value: string | string[] | undefined) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
