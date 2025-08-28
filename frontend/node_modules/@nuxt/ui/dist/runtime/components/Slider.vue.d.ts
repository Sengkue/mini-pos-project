import type { SliderRootProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/slider';
import type { TooltipProps } from '../types';
import type { ComponentConfig } from '../types/utils';
type Slider = ComponentConfig<typeof theme, AppConfig, 'slider'>;
export interface SliderProps extends Pick<SliderRootProps, 'name' | 'disabled' | 'inverted' | 'min' | 'max' | 'step' | 'minStepsBetweenThumbs'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'md'
     */
    size?: Slider['variants']['size'];
    /**
     * @defaultValue 'primary'
     */
    color?: Slider['variants']['color'];
    /**
     * The orientation of the slider.
     * @defaultValue 'horizontal'
     */
    orientation?: SliderRootProps['orientation'];
    /**
     * Display a tooltip around the slider thumbs with the current value.
     * `{ disableClosingTrigger: true }`{lang="ts-type"}
     * @defaultValue false
     */
    tooltip?: boolean | TooltipProps;
    /** The value of the slider when initially rendered. Use when you do not need to control the state of the slider. */
    defaultValue?: number | number[];
    class?: any;
    ui?: Slider['slots'];
}
export interface SliderEmits<T extends number | number[] = number | number[]> {
    'update:modelValue': [payload: T];
    'change': [payload: Event];
}
declare const _default: <T extends number | number[]>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onChange?: ((payload: Event) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((...args: unknown[]) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onChange" | "onUpdate:modelValue"> & (SliderProps & {
        modelValue?: T;
    }) & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: {};
    emit: (((evt: "change", payload: Event) => void) & ((evt: "update:modelValue", payload: T) => void)) & ((evt: "update:modelValue", value: T | undefined) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
