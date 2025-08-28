import type { ProgressRootProps, ProgressRootEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/progress';
import type { ComponentConfig } from '../types/utils';
type Progress = ComponentConfig<typeof theme, AppConfig, 'progress'>;
export interface ProgressProps extends Pick<ProgressRootProps, 'getValueLabel' | 'getValueText' | 'modelValue'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /** The maximum progress value. */
    max?: number | Array<any>;
    /** Display the current progress value. */
    status?: boolean;
    /** Whether the progress is visually inverted. */
    inverted?: boolean;
    /**
     * @defaultValue 'md'
     */
    size?: Progress['variants']['size'];
    /**
     * @defaultValue 'primary'
     */
    color?: Progress['variants']['color'];
    /**
     * The orientation of the progress bar.
     * @defaultValue 'horizontal'
     */
    orientation?: Progress['variants']['orientation'];
    /**
     * The animation of the progress bar.
     * @defaultValue 'carousel'
     */
    animation?: Progress['variants']['animation'];
    class?: any;
    ui?: Progress['slots'];
}
export interface ProgressEmits extends ProgressRootEmits {
}
export type ProgressSlots = {
    status(props: {
        percent?: number;
    }): any;
} & {
    [key: string]: (props: {
        step: number;
    }) => any;
};
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<ProgressProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string[] | undefined) => any;
    "update:max": (value: number) => any;
}, string, import("vue").PublicProps, Readonly<ProgressProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: string[] | undefined) => any) | undefined;
    "onUpdate:max"?: ((value: number) => any) | undefined;
}>, {
    orientation: Progress["variants"]["orientation"];
    modelValue: number | null;
    inverted: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProgressSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
