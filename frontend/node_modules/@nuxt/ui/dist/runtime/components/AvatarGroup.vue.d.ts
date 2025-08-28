import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/avatar-group';
import type { ComponentConfig } from '../types/utils';
type AvatarGroup = ComponentConfig<typeof theme, AppConfig, 'avatarGroup'>;
export interface AvatarGroupProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'md'
     */
    size?: AvatarGroup['variants']['size'];
    /**
     * The maximum number of avatars to display.
     */
    max?: number | string;
    class?: any;
    ui?: AvatarGroup['slots'];
}
export interface AvatarGroupSlots {
    default(props?: {}): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<AvatarGroupProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<AvatarGroupProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, AvatarGroupSlots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
