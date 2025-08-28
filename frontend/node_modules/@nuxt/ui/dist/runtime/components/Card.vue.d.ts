import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/card';
import type { ComponentConfig } from '../types/utils';
type Card = ComponentConfig<typeof theme, AppConfig, 'card'>;
export interface CardProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'outline'
     */
    variant?: Card['variants']['variant'];
    class?: any;
    ui?: Card['slots'];
}
export interface CardSlots {
    header(props?: {}): any;
    default(props?: {}): any;
    footer(props?: {}): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<CardProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<CardProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, CardSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
