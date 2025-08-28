import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/kbd';
import type { KbdKey } from '../composables/useKbd';
import type { ComponentConfig } from '../types/utils';
type Kbd = ComponentConfig<typeof theme, AppConfig, 'kbd'>;
export interface KbdProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'kbd'
     */
    as?: any;
    value?: KbdKey | string;
    /**
     * @defaultValue 'neutral'
     */
    color?: Kbd['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: Kbd['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: Kbd['variants']['size'];
    class?: any;
}
export interface KbdSlots {
    default(props?: {}): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<KbdProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<KbdProps> & Readonly<{}>, {
    as: any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, KbdSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
