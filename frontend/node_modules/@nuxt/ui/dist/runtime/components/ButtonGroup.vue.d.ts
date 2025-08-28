import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/button-group';
import type { ComponentConfig } from '../types/utils';
type ButtonGroup = ComponentConfig<typeof theme, AppConfig, 'buttonGroup'>;
export interface ButtonGroupProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'md'
     */
    size?: ButtonGroup['variants']['size'];
    /**
     * The orientation the buttons are laid out.
     * @defaultValue 'horizontal'
     */
    orientation?: ButtonGroup['variants']['orientation'];
    class?: any;
    ui?: ButtonGroup['slots'];
}
export interface ButtonGroupSlots {
    default(props?: {}): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<ButtonGroupProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ButtonGroupProps> & Readonly<{}>, {
    orientation: ButtonGroup["variants"]["orientation"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ButtonGroupSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
