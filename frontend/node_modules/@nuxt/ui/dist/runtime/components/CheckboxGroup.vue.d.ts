import type { CheckboxGroupRootProps, CheckboxGroupRootEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/checkbox-group';
import type { CheckboxProps } from '../types';
import type { AcceptableValue, ComponentConfig } from '../types/utils';
type CheckboxGroup = ComponentConfig<typeof theme, AppConfig, 'checkboxGroup'>;
export type CheckboxGroupValue = AcceptableValue;
export type CheckboxGroupItem = {
    label?: string;
    description?: string;
    disabled?: boolean;
    value?: string;
    class?: any;
    ui?: Pick<CheckboxGroup['slots'], 'item'> & Omit<Required<CheckboxProps>['ui'], 'root'>;
    [key: string]: any;
} | CheckboxGroupValue;
export interface CheckboxGroupProps<T extends CheckboxGroupItem = CheckboxGroupItem> extends Pick<CheckboxGroupRootProps, 'defaultValue' | 'disabled' | 'loop' | 'modelValue' | 'name' | 'required'>, Pick<CheckboxProps, 'color' | 'indicator' | 'icon'> {
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
    size?: CheckboxGroup['variants']['size'];
    /**
     * @defaultValue 'list'
     */
    variant?: CheckboxGroup['variants']['variant'];
    /**
     * The orientation the checkbox buttons are laid out.
     * @defaultValue 'vertical'
     */
    orientation?: CheckboxGroupRootProps['orientation'];
    class?: any;
    ui?: CheckboxGroup['slots'] & CheckboxProps['ui'];
}
export type CheckboxGroupEmits = CheckboxGroupRootEmits & {
    change: [payload: Event];
};
type SlotProps<T extends CheckboxGroupItem> = (props: {
    item: T & {
        id: string;
    };
}) => any;
export interface CheckboxGroupSlots<T extends CheckboxGroupItem = CheckboxGroupItem> {
    legend(props?: {}): any;
    label: SlotProps<T>;
    description: SlotProps<T>;
}
declare const _default: <T extends CheckboxGroupItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onChange?: ((payload: Event) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((value: import("reka-ui").AcceptableValue[]) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onChange" | "onUpdate:modelValue"> & CheckboxGroupProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: CheckboxGroupSlots<T>;
    emit: ((evt: "change", payload: Event) => void) & ((evt: "update:modelValue", value: import("reka-ui").AcceptableValue[]) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
