import type { PaginationRootProps, PaginationRootEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/pagination';
import type { ButtonProps } from '../types';
import type { ComponentConfig } from '../types/utils';
type Pagination = ComponentConfig<typeof theme, AppConfig, 'pagination'>;
export interface PaginationProps extends Partial<Pick<PaginationRootProps, 'defaultPage' | 'disabled' | 'itemsPerPage' | 'page' | 'showEdges' | 'siblingCount' | 'total'>> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * The icon to use for the first page control.
     * @defaultValue appConfig.ui.icons.chevronDoubleLeft
     * @IconifyIcon
     */
    firstIcon?: string;
    /**
     * The icon to use for the previous page control.
     * @defaultValue appConfig.ui.icons.chevronLeft
     * @IconifyIcon
     */
    prevIcon?: string;
    /**
     * The icon to use for the next page control.
     * @defaultValue appConfig.ui.icons.chevronRight
     * @IconifyIcon
     */
    nextIcon?: string;
    /**
     * The icon to use for the last page control.
     * @defaultValue appConfig.ui.icons.chevronDoubleRight
     * @IconifyIcon
     */
    lastIcon?: string;
    /**
     * The icon to use for the ellipsis control.
     * @defaultValue appConfig.ui.icons.ellipsis
     * @IconifyIcon
     */
    ellipsisIcon?: string;
    /**
     * The color of the pagination controls.
     * @defaultValue 'neutral'
     * @IconifyIcon
     */
    color?: ButtonProps['color'];
    /**
     * The variant of the pagination controls.
     * @defaultValue 'outline'
     */
    variant?: ButtonProps['variant'];
    /**
     * The color of the active pagination control.
     * @defaultValue 'primary'
     */
    activeColor?: ButtonProps['color'];
    /**
     * The variant of the active pagination control.
     * @defaultValue 'solid'
     */
    activeVariant?: ButtonProps['variant'];
    /**
     * Whether to show the first, previous, next, and last controls.
     * @defaultValue true
     */
    showControls?: boolean;
    size?: ButtonProps['size'];
    /**
     * A function to render page controls as links.
     * @param page The page number to navigate to.
     */
    to?: (page: number) => ButtonProps['to'];
    class?: any;
    ui?: Pagination['slots'];
}
export interface PaginationEmits extends PaginationRootEmits {
}
export interface PaginationSlots {
    first(props?: {}): any;
    prev(props?: {}): any;
    next(props?: {}): any;
    last(props?: {}): any;
    ellipsis(props?: {}): any;
    item(props: {
        page: number;
        pageCount: number;
        item: {
            type: 'ellipsis';
        } | {
            type: 'page';
            value: number;
        };
        index: number;
    }): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<PaginationProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:page": (value: number) => any;
}, string, import("vue").PublicProps, Readonly<PaginationProps> & Readonly<{
    "onUpdate:page"?: ((value: number) => any) | undefined;
}>, {
    color: "error" | "info" | "primary" | "secondary" | "success" | "warning" | "neutral";
    activeColor: "error" | "info" | "primary" | "secondary" | "success" | "warning" | "neutral";
    variant: "link" | "solid" | "outline" | "soft" | "subtle" | "ghost";
    activeVariant: "link" | "solid" | "outline" | "soft" | "subtle" | "ghost";
    itemsPerPage: number;
    showEdges: boolean;
    siblingCount: number;
    total: number;
    showControls: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, PaginationSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
