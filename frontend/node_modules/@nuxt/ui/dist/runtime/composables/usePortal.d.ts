import type { Ref, InjectionKey } from 'vue';
export declare const portalTargetInjectionKey: InjectionKey<Ref<string | HTMLElement>>;
export declare function usePortal(portal: Ref<string | HTMLElement | boolean | undefined>): import("vue").ComputedRef<{
    to: string | HTMLElement;
    disabled: boolean;
}>;
