import type { ListboxRootProps, ListboxRootEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import type { UseFuseOptions } from '@vueuse/integrations/useFuse';
import theme from '#build/ui/command-palette';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { AvatarProps, ButtonProps, ChipProps, KbdProps, InputProps, LinkProps } from '../types';
import type { ComponentConfig } from '../types/utils';
type CommandPalette = ComponentConfig<typeof theme, AppConfig, 'commandPalette'>;
export interface CommandPaletteItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
    prefix?: string;
    label?: string;
    suffix?: string;
    /**
     * @IconifyIcon
     */
    icon?: string;
    avatar?: AvatarProps;
    chip?: ChipProps;
    kbds?: KbdProps['value'][] | KbdProps[];
    active?: boolean;
    loading?: boolean;
    disabled?: boolean;
    slot?: string;
    /**
     * The placeholder to display when the item has children.
     */
    placeholder?: string;
    children?: CommandPaletteItem[];
    onSelect?(e?: Event): void;
    class?: any;
    ui?: Pick<CommandPalette['slots'], 'item' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLeadingChipSize' | 'itemLeadingChip' | 'itemLabel' | 'itemLabelPrefix' | 'itemLabelBase' | 'itemLabelSuffix' | 'itemTrailing' | 'itemTrailingKbds' | 'itemTrailingKbdsSize' | 'itemTrailingHighlightedIcon' | 'itemTrailingIcon'>;
    [key: string]: any;
}
export interface CommandPaletteGroup<T extends CommandPaletteItem = CommandPaletteItem> {
    id: string;
    label?: string;
    slot?: string;
    items?: T[];
    /**
     * Whether to filter group items with [useFuse](https://vueuse.org/integrations/useFuse).
     * When `true`, items will not be filtered which is useful for custom filtering (useAsyncData, useFetch, etc.).
     * @defaultValue false
     */
    ignoreFilter?: boolean;
    /** Filter group items after the search happened. */
    postFilter?: (searchTerm: string, items: T[]) => T[];
    /**
     * The icon displayed when an item is highlighted.
     * @IconifyIcon
     */
    highlightedIcon?: string;
}
export interface CommandPaletteProps<G extends CommandPaletteGroup<T> = CommandPaletteGroup<any>, T extends CommandPaletteItem = CommandPaletteItem> extends Pick<ListboxRootProps, 'multiple' | 'disabled' | 'modelValue' | 'defaultValue' | 'highlightOnHover' | 'selectionBehavior'>, Pick<UseComponentIconsProps, 'loading' | 'loadingIcon'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * The icon displayed in the input.
     * @defaultValue appConfig.ui.icons.search
     * @IconifyIcon
     */
    icon?: string;
    /**
     * The icon displayed when an item is selected.
     * @defaultValue appConfig.ui.icons.check
     * @IconifyIcon
     */
    selectedIcon?: string;
    /**
     * The icon displayed when an item has children.
     * @defaultValue appConfig.ui.icons.chevronRight
     * @IconifyIcon
     */
    trailingIcon?: string;
    /**
     * The placeholder text for the input.
     * @defaultValue t('commandPalette.placeholder')
     */
    placeholder?: InputProps['placeholder'];
    /**
     * Automatically focus the input when component is mounted.
     * @defaultValue true
     */
    autofocus?: boolean;
    /**
     * Display a close button in the input (useful when inside a Modal for example).
     * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     * @emits 'update:open'
     * @defaultValue false
     */
    close?: boolean | Partial<ButtonProps>;
    /**
     * The icon displayed in the close button.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    closeIcon?: string;
    /**
     * Display a button to navigate back in history.
     * `{ size: 'md', color: 'neutral', variant: 'link' }`{lang="ts-type"}
     * @defaultValue true
     */
    back?: boolean | ButtonProps;
    /**
     * The icon displayed in the back button.
     * @defaultValue appConfig.ui.icons.arrowLeft
     * @IconifyIcon
     */
    backIcon?: string;
    groups?: G[];
    /**
     * Options for [useFuse](https://vueuse.org/integrations/useFuse).
     * @defaultValue {
        fuseOptions: {
          ignoreLocation: true,
          threshold: 0.1,
          keys: ['label', 'suffix']
        },
        resultLimit: 12,
        matchAllWhenSearchEmpty: true
      }
     */
    fuse?: UseFuseOptions<T>;
    /**
     * The key used to get the label from the item.
     * @defaultValue 'label'
     */
    labelKey?: string;
    class?: any;
    ui?: CommandPalette['slots'];
}
export type CommandPaletteEmits<T extends CommandPaletteItem = CommandPaletteItem> = ListboxRootEmits<T> & {
    'update:open': [value: boolean];
};
type SlotProps<T> = (props: {
    item: T;
    index: number;
}) => any;
export type CommandPaletteSlots<G extends CommandPaletteGroup<T> = CommandPaletteGroup<any>, T extends CommandPaletteItem = CommandPaletteItem> = {
    'empty'(props: {
        searchTerm?: string;
    }): any;
    'footer'(props: {
        ui: {
            [K in keyof Required<CommandPalette['slots']>]: (props?: Record<string, any>) => string;
        };
    }): any;
    'back'(props: {
        ui: {
            [K in keyof Required<CommandPalette['slots']>]: (props?: Record<string, any>) => string;
        };
    }): any;
    'close'(props: {
        ui: {
            [K in keyof Required<CommandPalette['slots']>]: (props?: Record<string, any>) => string;
        };
    }): any;
    'item': SlotProps<T>;
    'item-leading': SlotProps<T>;
    'item-label': SlotProps<T>;
    'item-trailing': SlotProps<T>;
} & Record<string, SlotProps<G>> & Record<string, SlotProps<T>>;
declare const _default: <G extends CommandPaletteGroup<T>, T extends CommandPaletteItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onUpdate:open"?: ((value: boolean) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((value: T) => any) | undefined;
        readonly onHighlight?: ((payload: {
            ref: HTMLElement;
            value: T;
        } | undefined) => any) | undefined;
        readonly "onUpdate:searchTerm"?: ((value: string) => any) | undefined;
        readonly onEntryFocus?: ((event: CustomEvent<any>) => any) | undefined;
        readonly onLeave?: ((event: Event) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onUpdate:open" | "onUpdate:modelValue" | "onHighlight" | "onUpdate:searchTerm" | "onEntryFocus" | "onLeave"> & (CommandPaletteProps<G, T> & {
        searchTerm?: string;
    }) & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: CommandPaletteSlots<G, T>;
    emit: (((evt: "update:open", value: boolean) => void) & ((evt: "update:modelValue", value: T) => void) & ((evt: "highlight", payload: {
        ref: HTMLElement;
        value: T;
    } | undefined) => void) & ((evt: "entryFocus", event: CustomEvent<any>) => void) & ((evt: "leave", event: Event) => void)) & ((evt: "update:searchTerm", value: string) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
