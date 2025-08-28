import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/timeline';
import type { AvatarProps } from '../types';
import type { DynamicSlots, ComponentConfig } from '../types/utils';
type Timeline = ComponentConfig<typeof theme, AppConfig, 'timeline'>;
export interface TimelineItem {
    date?: string;
    title?: string;
    description?: string;
    icon?: string;
    avatar?: AvatarProps;
    value?: string | number;
    slot?: string;
    class?: any;
    ui?: Pick<Timeline['slots'], 'item' | 'container' | 'indicator' | 'separator' | 'wrapper' | 'date' | 'title' | 'description'>;
    [key: string]: any;
}
export interface TimelineProps<T extends TimelineItem = TimelineItem> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    items: T[];
    /**
     * @defaultValue 'md'
     */
    size?: Timeline['variants']['size'];
    /**
     * @defaultValue 'primary'
     */
    color?: Timeline['variants']['color'];
    /**
     * The orientation of the Timeline.
     * @defaultValue 'vertical'
     */
    orientation?: Timeline['variants']['orientation'];
    defaultValue?: string | number;
    reverse?: boolean;
    class?: any;
    ui?: Timeline['slots'];
}
type SlotProps<T extends TimelineItem> = (props: {
    item: T;
}) => any;
export type TimelineSlots<T extends TimelineItem = TimelineItem> = {
    indicator: SlotProps<T>;
    date: SlotProps<T>;
    title: SlotProps<T>;
    description: SlotProps<T>;
} & DynamicSlots<T, 'indicator' | 'date' | 'title' | 'description', {
    item: T;
}>;
declare const _default: <T extends TimelineItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onUpdate:modelValue"?: ((value: string | number | undefined) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onUpdate:modelValue"> & (TimelineProps<T> & {
        modelValue?: string | number;
    }) & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: TimelineSlots<T>;
    emit: (evt: "update:modelValue", value: string | number | undefined) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
