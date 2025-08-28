import type { AppConfig } from '@nuxt/schema';
import type { AcceptableValue } from 'reka-ui';
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import type { AutoplayOptionsType } from 'embla-carousel-autoplay';
import type { AutoScrollOptionsType } from 'embla-carousel-auto-scroll';
import type { AutoHeightOptionsType } from 'embla-carousel-auto-height';
import type { ClassNamesOptionsType } from 'embla-carousel-class-names';
import type { FadeOptionsType } from 'embla-carousel-fade';
import type { WheelGesturesPluginOptions } from 'embla-carousel-wheel-gestures';
import theme from '#build/ui/carousel';
import type { ButtonProps } from '../types';
import type { ComponentConfig } from '../types/utils';
type Carousel = ComponentConfig<typeof theme, AppConfig, 'carousel'>;
interface _CarouselItem {
    class?: any;
    ui?: Pick<Carousel['slots'], 'item'>;
    [key: string]: any;
}
export type CarouselItem = _CarouselItem | AcceptableValue;
export interface CarouselProps<T extends CarouselItem = CarouselItem> extends Omit<EmblaOptionsType, 'axis' | 'container' | 'slides' | 'direction'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * Configure the prev button when arrows are enabled.
     * @defaultValue { size: 'md', color: 'neutral', variant: 'link' }
     */
    prev?: ButtonProps;
    /**
     * The icon displayed in the prev button.
     * @defaultValue appConfig.ui.icons.arrowLeft
     * @IconifyIcon
     */
    prevIcon?: string;
    /**
     * Configure the next button when arrows are enabled.
     * @defaultValue { size: 'md', color: 'neutral', variant: 'link' }
     */
    next?: ButtonProps;
    /**
     * The icon displayed in the next button.
     * @defaultValue appConfig.ui.icons.arrowRight
     * @IconifyIcon
     */
    nextIcon?: string;
    /**
     * Display prev and next buttons to scroll the carousel.
     * @defaultValue false
     */
    arrows?: boolean;
    /**
     * Display dots to scroll to a specific slide.
     * @defaultValue false
     */
    dots?: boolean;
    /**
     * The orientation of the carousel.
     * @defaultValue 'horizontal'
     */
    orientation?: Carousel['variants']['orientation'];
    items?: T[];
    /**
     * Enable Autoplay plugin
     * @link https://www.embla-carousel.com/plugins/autoplay/
     */
    autoplay?: boolean | AutoplayOptionsType;
    /**
     * Enable Auto Scroll plugin
     * @link https://www.embla-carousel.com/plugins/auto-scroll/
     */
    autoScroll?: boolean | AutoScrollOptionsType;
    /**
     * Enable Auto Height plugin
     * @link https://www.embla-carousel.com/plugins/auto-height/
     */
    autoHeight?: boolean | AutoHeightOptionsType;
    /**
     * Enable Class Names plugin
     * @link https://www.embla-carousel.com/plugins/class-names/
     */
    classNames?: boolean | ClassNamesOptionsType;
    /**
     * Enable Fade plugin
     * @link https://www.embla-carousel.com/plugins/fade/
     */
    fade?: boolean | FadeOptionsType;
    /**
     * Enable Wheel Gestures plugin
     * @link https://www.embla-carousel.com/plugins/wheel-gestures/
     */
    wheelGestures?: boolean | WheelGesturesPluginOptions;
    class?: any;
    ui?: Carousel['slots'];
}
export type CarouselSlots<T extends CarouselItem = CarouselItem> = {
    default(props: {
        item: T;
        index: number;
    }): any;
};
export interface CarouselEmits {
    /**
     * Emitted when the selected slide changes
     * @param selectedIndex The index of the selected slide
     */
    select: [selectedIndex: number];
}
declare const _default: <T extends CarouselItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onSelect?: ((selectedIndex: number) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onSelect"> & CarouselProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        emblaRef: import("vue").Ref<HTMLElement | undefined, HTMLElement | undefined>;
        emblaApi: import("vue").Ref<EmblaCarouselType | undefined, EmblaCarouselType | undefined>;
    }>): void;
    attrs: any;
    slots: CarouselSlots<T>;
    emit: (evt: "select", selectedIndex: number) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
