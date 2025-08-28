import type { ToastRootProps, ToastRootEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/toast';
import type { AvatarProps, ButtonProps, ProgressProps } from '../types';
import type { StringOrVNode, ComponentConfig } from '../types/utils';
type Toast = ComponentConfig<typeof theme, AppConfig, 'toast'>;
export interface ToastProps extends Pick<ToastRootProps, 'defaultOpen' | 'open' | 'type' | 'duration'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'li'
     */
    as?: any;
    title?: StringOrVNode;
    description?: StringOrVNode;
    /**
     * @IconifyIcon
     */
    icon?: string;
    avatar?: AvatarProps;
    /**
     * @defaultValue 'primary'
     */
    color?: Toast['variants']['color'];
    /**
     * The orientation between the content and the actions.
     * @defaultValue 'vertical'
     */
    orientation?: Toast['variants']['orientation'];
    /**
     * Display a close button to dismiss the toast.
     * `{ size: 'md', color: 'neutral', variant: 'link' }`{lang="ts-type"}
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
     * Display a list of actions:
     * - under the title and description when orientation is `vertical`
     * - next to the close button when orientation is `horizontal`
     * `{ size: 'xs' }`{lang="ts-type"}
     */
    actions?: ButtonProps[];
    /**
     * Display a progress bar showing the toast's remaining duration.
     * `{ size: 'sm' }`{lang="ts-type"}
     * @defaultValue true
     */
    progress?: boolean | Pick<ProgressProps, 'color' | 'ui'>;
    class?: any;
    ui?: Toast['slots'];
}
export interface ToastEmits extends ToastRootEmits {
}
export interface ToastSlots {
    leading(props?: {}): any;
    title(props?: {}): any;
    description(props?: {}): any;
    actions(props?: {}): any;
    close(props: {
        ui: {
            [K in keyof Required<Toast['slots']>]: (props?: Record<string, any>) => string;
        };
    }): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<ToastProps, {
    height: import("vue").Ref<number, number>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    resume: () => any;
    pause: () => any;
    "update:open": (value: boolean) => any;
    escapeKeyDown: (event: KeyboardEvent) => any;
    swipeStart: (event: {
        currentTarget: EventTarget & HTMLElement;
    } & Omit<CustomEvent<{
        originalEvent: PointerEvent;
        delta: {
            x: number;
            y: number;
        };
    }>, "currentTarget">) => any;
    swipeMove: (event: {
        currentTarget: EventTarget & HTMLElement;
    } & Omit<CustomEvent<{
        originalEvent: PointerEvent;
        delta: {
            x: number;
            y: number;
        };
    }>, "currentTarget">) => any;
    swipeCancel: (event: {
        currentTarget: EventTarget & HTMLElement;
    } & Omit<CustomEvent<{
        originalEvent: PointerEvent;
        delta: {
            x: number;
            y: number;
        };
    }>, "currentTarget">) => any;
    swipeEnd: (event: {
        currentTarget: EventTarget & HTMLElement;
    } & Omit<CustomEvent<{
        originalEvent: PointerEvent;
        delta: {
            x: number;
            y: number;
        };
    }>, "currentTarget">) => any;
}, string, import("vue").PublicProps, Readonly<ToastProps> & Readonly<{
    onResume?: (() => any) | undefined;
    onPause?: (() => any) | undefined;
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
    onEscapeKeyDown?: ((event: KeyboardEvent) => any) | undefined;
    onSwipeStart?: ((event: {
        currentTarget: EventTarget & HTMLElement;
    } & Omit<CustomEvent<{
        originalEvent: PointerEvent;
        delta: {
            x: number;
            y: number;
        };
    }>, "currentTarget">) => any) | undefined;
    onSwipeMove?: ((event: {
        currentTarget: EventTarget & HTMLElement;
    } & Omit<CustomEvent<{
        originalEvent: PointerEvent;
        delta: {
            x: number;
            y: number;
        };
    }>, "currentTarget">) => any) | undefined;
    onSwipeCancel?: ((event: {
        currentTarget: EventTarget & HTMLElement;
    } & Omit<CustomEvent<{
        originalEvent: PointerEvent;
        delta: {
            x: number;
            y: number;
        };
    }>, "currentTarget">) => any) | undefined;
    onSwipeEnd?: ((event: {
        currentTarget: EventTarget & HTMLElement;
    } & Omit<CustomEvent<{
        originalEvent: PointerEvent;
        delta: {
            x: number;
            y: number;
        };
    }>, "currentTarget">) => any) | undefined;
}>, {
    close: boolean | Partial<ButtonProps>;
    progress: boolean | Pick<ProgressProps, "color" | "ui">;
    orientation: Toast["variants"]["orientation"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ToastSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
