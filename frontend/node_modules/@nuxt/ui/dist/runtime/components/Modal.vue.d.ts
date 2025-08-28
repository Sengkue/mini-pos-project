import type { DialogRootProps, DialogRootEmits, DialogContentProps, DialogContentEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/modal';
import type { ButtonProps } from '../types';
import type { EmitsToProps, ComponentConfig } from '../types/utils';
type Modal = ComponentConfig<typeof theme, AppConfig, 'modal'>;
export interface ModalProps extends DialogRootProps {
    title?: string;
    description?: string;
    /** The content of the modal. */
    content?: Omit<DialogContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DialogContentEmits>>;
    /**
     * Render an overlay behind the modal.
     * @defaultValue true
     */
    overlay?: boolean;
    /**
     * Animate the modal when opening or closing.
     * @defaultValue true
     */
    transition?: boolean;
    /**
     * When `true`, the modal will take up the full screen.
     * @defaultValue false
     */
    fullscreen?: boolean;
    /**
     * Render the modal in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
    /**
     * Display a close button to dismiss the modal.
     * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     * @defaultValue true
     */
    close?: boolean | Partial<ButtonProps>;
    /**
     * The icon displayed in the close button.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    closeIcon?: string;
    /**
     * When `false`, the modal will not close when clicking outside or pressing escape.
     * @defaultValue true
     */
    dismissible?: boolean;
    class?: any;
    ui?: Modal['slots'];
}
export interface ModalEmits extends DialogRootEmits {
    'after:leave': [];
    'after:enter': [];
    'close:prevent': [];
}
export interface ModalSlots {
    default(props: {
        open: boolean;
    }): any;
    content(props: {
        close: () => void;
    }): any;
    header(props: {
        close: () => void;
    }): any;
    title(props?: {}): any;
    description(props?: {}): any;
    actions(props?: {}): any;
    close(props: {
        close: () => void;
        ui: {
            [K in keyof Required<Modal['slots']>]: (props?: Record<string, any>) => string;
        };
    }): any;
    body(props: {
        close: () => void;
    }): any;
    footer(props: {
        close: () => void;
    }): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<ModalProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (value: boolean) => any;
    "after:leave": () => any;
    "after:enter": () => any;
    "close:prevent": () => any;
}, string, import("vue").PublicProps, Readonly<ModalProps> & Readonly<{
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
    "onAfter:leave"?: (() => any) | undefined;
    "onAfter:enter"?: (() => any) | undefined;
    "onClose:prevent"?: (() => any) | undefined;
}>, {
    close: boolean | Partial<ButtonProps>;
    modal: boolean;
    transition: boolean;
    portal: boolean | string | HTMLElement;
    overlay: boolean;
    dismissible: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ModalSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
