import type { CollapsibleRootProps, CollapsibleRootEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/collapsible';
import type { ComponentConfig } from '../types/utils';
type Collapsible = ComponentConfig<typeof theme, AppConfig, 'collapsible'>;
export interface CollapsibleProps extends Pick<CollapsibleRootProps, 'defaultOpen' | 'open' | 'disabled' | 'unmountOnHide'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    class?: any;
    ui?: Collapsible['slots'];
}
export interface CollapsibleEmits extends CollapsibleRootEmits {
}
export interface CollapsibleSlots {
    default(props: {
        open: boolean;
    }): any;
    content(props?: {}): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<CollapsibleProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<CollapsibleProps> & Readonly<{
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
}>, {
    unmountOnHide: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, CollapsibleSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
