import type { ConfigProviderProps, TooltipProviderProps } from 'reka-ui';
import type { ToasterProps, Locale, Messages } from '../types';
export interface AppProps<T extends Messages = Messages> extends Omit<ConfigProviderProps, 'useId' | 'dir' | 'locale'> {
    tooltip?: TooltipProviderProps;
    toaster?: ToasterProps | null;
    locale?: Locale<T>;
    portal?: string | HTMLElement;
}
export interface AppSlots {
    default(props?: {}): any;
}
declare const _default: <T extends Messages>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{} & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, never> & AppProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: AppSlots;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
