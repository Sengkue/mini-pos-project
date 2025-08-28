import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/chip';
import type { ComponentConfig } from '../types/utils';
type Chip = ComponentConfig<typeof theme, AppConfig, 'chip'>;
export interface ChipProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /** Display some text inside the chip. */
    text?: string | number;
    /**
     * @defaultValue 'primary'
     */
    color?: Chip['variants']['color'];
    /**
     * @defaultValue 'md'
     */
    size?: Chip['variants']['size'];
    /**
     * The position of the chip.
     * @defaultValue 'top-right'
     */
    position?: Chip['variants']['position'];
    /** When `true`, keep the chip inside the component for rounded elements. */
    inset?: boolean;
    /** When `true`, render the chip relatively to the parent. */
    standalone?: boolean;
    class?: any;
    ui?: Chip['slots'];
}
export interface ChipEmits {
    'update:show': [payload: boolean];
}
export interface ChipSlots {
    default(props?: {}): any;
    content(props?: {}): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<ChipProps & {
    show?: boolean;
}, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:show": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<ChipProps & {
    show?: boolean;
}> & Readonly<{
    "onUpdate:show"?: ((value: boolean) => any) | undefined;
}>, {
    inset: boolean;
    standalone: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ChipSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
