import type { CalendarRootProps, CalendarRootEmits, RangeCalendarRootProps, RangeCalendarRootEmits, DateRange, CalendarCellTriggerProps } from 'reka-ui';
import type { DateValue } from '@internationalized/date';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/calendar';
import type { ButtonProps } from '../types';
import type { ComponentConfig } from '../types/utils';
type Calendar = ComponentConfig<typeof theme, AppConfig, 'calendar'>;
type CalendarDefaultValue<R extends boolean = false, M extends boolean = false> = R extends true ? DateRange : M extends true ? DateValue[] : DateValue;
type CalendarModelValue<R extends boolean = false, M extends boolean = false> = R extends true ? (DateRange | null) : M extends true ? (DateValue[] | undefined) : (DateValue | undefined);
type _CalendarRootProps = Omit<CalendarRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale' | 'calendarLabel' | 'multiple'>;
type _RangeCalendarRootProps = Omit<RangeCalendarRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale' | 'calendarLabel' | 'multiple'>;
export interface CalendarProps<R extends boolean = false, M extends boolean = false> extends _RangeCalendarRootProps, _CalendarRootProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * The icon to use for the next year control.
     * @defaultValue appConfig.ui.icons.chevronDoubleRight
     * @IconifyIcon
     */
    nextYearIcon?: string;
    /**
     * Configure the next year button.
     * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     */
    nextYear?: ButtonProps;
    /**
     * The icon to use for the next month control.
     * @defaultValue appConfig.ui.icons.chevronRight
     * @IconifyIcon
     */
    nextMonthIcon?: string;
    /**
     * Configure the next month button.
     * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     */
    nextMonth?: ButtonProps;
    /**
     * The icon to use for the previous year control.
     * @defaultValue appConfig.ui.icons.chevronDoubleLeft
     * @IconifyIcon
     */
    prevYearIcon?: string;
    /**
     * Configure the prev year button.
     * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     */
    prevYear?: ButtonProps;
    /**
     * The icon to use for the previous month control.
     * @defaultValue appConfig.ui.icons.chevronLeft
     * @IconifyIcon
     */
    prevMonthIcon?: string;
    /**
     * Configure the prev month button.
     * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     */
    prevMonth?: ButtonProps;
    /**
     * @defaultValue 'primary'
     */
    color?: Calendar['variants']['color'];
    /**
     * @defaultValue 'md'
     */
    size?: Calendar['variants']['size'];
    /** Whether or not a range of dates can be selected */
    range?: R & boolean;
    /** Whether or not multiple dates can be selected */
    multiple?: M & boolean;
    /** Show month controls */
    monthControls?: boolean;
    /** Show year controls */
    yearControls?: boolean;
    defaultValue?: CalendarDefaultValue<R, M>;
    modelValue?: CalendarModelValue<R, M>;
    class?: any;
    ui?: Calendar['slots'];
}
export interface CalendarEmits<R extends boolean, M extends boolean> extends Omit<CalendarRootEmits & RangeCalendarRootEmits, 'update:modelValue'> {
    'update:modelValue': [date: CalendarModelValue<R, M>];
}
export interface CalendarSlots {
    'heading': (props: {
        value: string;
    }) => any;
    'day': (props: Pick<CalendarCellTriggerProps, 'day'>) => any;
    'week-day': (props: {
        day: string;
    }) => any;
}
declare const _default: <R extends boolean, M extends boolean>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onUpdate:modelValue"?: ((date: CalendarModelValue<R, M>) => any) | undefined;
        readonly "onUpdate:placeholder"?: ((...args: unknown[]) => any) | undefined;
        readonly "onUpdate:startValue"?: ((date: DateValue | undefined) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onUpdate:modelValue" | "onUpdate:placeholder" | "onUpdate:startValue"> & CalendarProps<R, M> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: CalendarSlots;
    emit: ((evt: "update:modelValue", date: CalendarModelValue<R, M>) => void) & ((evt: "update:placeholder", ...args: [date: DateValue] & [date: DateValue]) => void) & ((evt: "update:startValue", date: DateValue | undefined) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
