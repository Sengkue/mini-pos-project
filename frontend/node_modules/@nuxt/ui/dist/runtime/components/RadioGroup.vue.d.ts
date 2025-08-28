import type { RadioGroupRootProps, RadioGroupRootEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/radio-group';
import type { AcceptableValue, ComponentConfig } from '../types/utils';
type RadioGroup = ComponentConfig<typeof theme, AppConfig, 'radioGroup'>;
export type RadioGroupValue = AcceptableValue;
export type RadioGroupItem = {
    label?: string;
    description?: string;
    disabled?: boolean;
    value?: RadioGroupValue;
    class?: any;
    ui?: Pick<RadioGroup['slots'], 'item' | 'container' | 'base' | 'indicator' | 'wrapper' | 'label' | 'description'>;
    [key: string]: any;
} | RadioGroupValue;
export interface RadioGroupProps<T extends RadioGroupItem = RadioGroupItem> extends Pick<RadioGroupRootProps, 'defaultValue' | 'disabled' | 'loop' | 'modelValue' | 'name' | 'required'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    legend?: string;
    /**
     * When `items` is an array of objects, select the field to use as the value.
     * @defaultValue 'value'
     */
    valueKey?: string;
    /**
     * When `items` is an array of objects, select the field to use as the label.
     * @defaultValue 'label'
     */
    labelKey?: string;
    /**
     * When `items` is an array of objects, select the field to use as the description.
     * @defaultValue 'description'
     */
    descriptionKey?: string;
    items?: T[];
    /**
     * @defaultValue 'md'
     */
    size?: RadioGroup['variants']['size'];
    /**
     * @defaultValue 'list'
     */
    variant?: RadioGroup['variants']['variant'];
    /**
     * @defaultValue 'primary'
     */
    color?: RadioGroup['variants']['color'];
    /**
     * The orientation the radio buttons are laid out.
     * @defaultValue 'vertical'
     */
    orientation?: RadioGroupRootProps['orientation'];
    /**
     * Position of the indicator.
     * @defaultValue 'start'
     */
    indicator?: RadioGroup['variants']['indicator'];
    class?: any;
    ui?: RadioGroup['slots'];
}
export type RadioGroupEmits = RadioGroupRootEmits & {
    change: [payload: Event];
};
type NormalizeItem<T extends RadioGroupItem> = Exclude<T & {
    id: string;
}, RadioGroupValue>;
type SlotProps<T extends RadioGroupItem> = (props: {
    item: NormalizeItem<T>;
    modelValue?: RadioGroupValue;
}) => any;
export interface RadioGroupSlots<T extends RadioGroupItem = RadioGroupItem> {
    legend(props?: {}): any;
    label: SlotProps<T>;
    description: SlotProps<T>;
}
declare const _default: <T extends RadioGroupItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onChange?: ((payload: Event) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((payload: string) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onChange" | "onUpdate:modelValue"> & RadioGroupProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: RadioGroupSlots<T>;
    emit: ((evt: "change", payload: Event) => void) & ((evt: "update:modelValue", payload: string) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
