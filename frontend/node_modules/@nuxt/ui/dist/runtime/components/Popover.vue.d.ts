import { Popover } from 'reka-ui/namespaced';
import type { PopoverRootProps, HoverCardRootProps, PopoverRootEmits, PopoverContentProps, PopoverContentEmits, PopoverArrowProps, HoverCardTriggerProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/popover';
import type { EmitsToProps, ComponentConfig } from '../types/utils';
type Popover = ComponentConfig<typeof theme, AppConfig, 'popover'>;
export interface PopoverProps extends PopoverRootProps, Pick<HoverCardRootProps, 'openDelay' | 'closeDelay'> {
    /**
     * The display mode of the popover.
     * @defaultValue 'click'
     */
    mode?: 'click' | 'hover';
    /**
     * The content of the popover.
     * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8 }
     */
    content?: Omit<PopoverContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<PopoverContentEmits>>;
    /**
     * Display an arrow alongside the popover.
     * @defaultValue false
     */
    arrow?: boolean | Omit<PopoverArrowProps, 'as' | 'asChild'>;
    /**
     * Render the popover in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
    /**
     * The reference (or anchor) element that is being referred to for positioning.
     *
     * If not provided will use the current component as anchor.
     */
    reference?: HoverCardTriggerProps['reference'];
    /**
     * When `false`, the popover will not close when clicking outside or pressing escape.
     * @defaultValue true
     */
    dismissible?: boolean;
    class?: any;
    ui?: Popover['slots'];
}
export interface PopoverEmits extends PopoverRootEmits {
    'close:prevent': [];
}
export interface PopoverSlots {
    default(props: {
        open: boolean;
    }): any;
    content(props?: {}): any;
    anchor(props?: {}): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<PopoverProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (value: boolean) => any;
    "close:prevent": () => any;
}, string, import("vue").PublicProps, Readonly<PopoverProps> & Readonly<{
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
    "onClose:prevent"?: (() => any) | undefined;
}>, {
    mode: "click" | "hover";
    portal: boolean | string | HTMLElement;
    dismissible: boolean;
    openDelay: number;
    closeDelay: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, PopoverSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
