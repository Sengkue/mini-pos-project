import type { StepperRootProps, StepperRootEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/stepper';
import type { DynamicSlots, ComponentConfig } from '../types/utils';
type Stepper = ComponentConfig<typeof theme, AppConfig, 'stepper'>;
export interface StepperItem {
    slot?: string;
    value?: string | number;
    title?: string;
    description?: string;
    /**
     * @IconifyIcon
     */
    icon?: string;
    content?: string;
    disabled?: boolean;
    class?: any;
    ui?: Pick<Stepper['slots'], 'item' | 'container' | 'trigger' | 'indicator' | 'icon' | 'separator' | 'wrapper' | 'title' | 'description'>;
    [key: string]: any;
}
export interface StepperProps<T extends StepperItem = StepperItem> extends Pick<StepperRootProps, 'linear'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    items: T[];
    /**
     * @defaultValue 'md'
     */
    size?: Stepper['variants']['size'];
    /**
     * @defaultValue 'primary'
     */
    color?: Stepper['variants']['color'];
    /**
     * The orientation of the stepper.
     * @defaultValue 'horizontal'
     */
    orientation?: Stepper['variants']['orientation'];
    /**
     * The value of the step that should be active when initially rendered. Use when you do not need to control the state of the steps.
     */
    defaultValue?: string | number;
    disabled?: boolean;
    class?: any;
    ui?: Stepper['slots'];
}
export type StepperEmits<T extends StepperItem = StepperItem> = Omit<StepperRootEmits, 'update:modelValue'> & {
    next: [payload: T];
    prev: [payload: T];
};
type SlotProps<T extends StepperItem> = (props: {
    item: T;
}) => any;
export type StepperSlots<T extends StepperItem = StepperItem> = {
    indicator: SlotProps<T>;
    title: SlotProps<T>;
    description: SlotProps<T>;
    content: SlotProps<T>;
} & DynamicSlots<T>;
declare const _default: <T extends StepperItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onPrev?: ((payload: T) => any) | undefined;
        readonly onNext?: ((payload: T) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((value: string | number | undefined) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onUpdate:modelValue" | "onPrev" | "onNext"> & (StepperProps<T> & {
        modelValue?: string | number;
    }) & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        next(): void;
        prev(): void;
        hasNext: import("vue").ComputedRef<boolean>;
        hasPrev: import("vue").ComputedRef<boolean>;
    }>): void;
    attrs: any;
    slots: StepperSlots<T>;
    emit: (((evt: "prev", payload: T) => void) & ((evt: "next", payload: T) => void)) & ((evt: "update:modelValue", value: string | number | undefined) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
