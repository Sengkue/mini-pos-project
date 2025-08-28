import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/avatar';
import type { ChipProps } from '../types';
import type { ComponentConfig } from '../types/utils';
type Avatar = ComponentConfig<typeof theme, AppConfig, 'avatar'>;
export interface AvatarProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'span'
     */
    as?: any;
    src?: string;
    alt?: string;
    /**
     * @IconifyIcon
     */
    icon?: string;
    text?: string;
    /**
     * @defaultValue 'md'
     */
    size?: Avatar['variants']['size'];
    chip?: boolean | ChipProps;
    class?: any;
    style?: any;
    ui?: Avatar['slots'];
}
export interface AvatarSlots {
    default(props?: {}): any;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<AvatarProps, void, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<AvatarProps> & Readonly<{}>, {
    as: any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, {
    default?: (props: {}) => any;
}>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
