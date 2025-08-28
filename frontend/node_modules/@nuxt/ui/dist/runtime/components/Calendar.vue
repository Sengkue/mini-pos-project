<script>
import theme from "#build/ui/calendar";
</script>

<script setup>
import { computed } from "vue";
import { useForwardPropsEmits } from "reka-ui";
import { Calendar as SingleCalendar, RangeCalendar } from "reka-ui/namespaced";
import { reactiveOmit } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
const props = defineProps({
  as: { type: null, required: false },
  nextYearIcon: { type: String, required: false },
  nextYear: { type: Object, required: false },
  nextMonthIcon: { type: String, required: false },
  nextMonth: { type: Object, required: false },
  prevYearIcon: { type: String, required: false },
  prevYear: { type: Object, required: false },
  prevMonthIcon: { type: String, required: false },
  prevMonth: { type: Object, required: false },
  color: { type: null, required: false },
  size: { type: null, required: false },
  range: { type: Boolean, required: false },
  multiple: { type: Boolean, required: false },
  monthControls: { type: Boolean, required: false, default: true },
  yearControls: { type: Boolean, required: false, default: true },
  defaultValue: { type: null, required: false },
  modelValue: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  defaultPlaceholder: { type: null, required: false },
  placeholder: { type: null, required: false },
  allowNonContiguousRanges: { type: Boolean, required: false },
  pagedNavigation: { type: Boolean, required: false },
  preventDeselect: { type: Boolean, required: false },
  maximumDays: { type: Number, required: false },
  weekStartsOn: { type: Number, required: false },
  weekdayFormat: { type: String, required: false },
  fixedWeeks: { type: Boolean, required: false, default: true },
  maxValue: { type: null, required: false },
  minValue: { type: null, required: false },
  numberOfMonths: { type: Number, required: false },
  disabled: { type: Boolean, required: false },
  readonly: { type: Boolean, required: false },
  initialFocus: { type: Boolean, required: false },
  isDateDisabled: { type: Function, required: false },
  isDateUnavailable: { type: Function, required: false },
  isDateHighlightable: { type: Function, required: false },
  nextPage: { type: Function, required: false },
  prevPage: { type: Function, required: false },
  disableDaysOutsideCurrentView: { type: Boolean, required: false },
  fixedDate: { type: String, required: false }
});
const emits = defineEmits(["update:modelValue", "update:placeholder", "update:startValue"]);
defineSlots();
const { code: locale, dir, t } = useLocale();
const appConfig = useAppConfig();
const rootProps = useForwardPropsEmits(reactiveOmit(props, "range", "modelValue", "defaultValue", "color", "size", "monthControls", "yearControls", "class", "ui"), emits);
const nextYearIcon = computed(() => props.nextYearIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleLeft : appConfig.ui.icons.chevronDoubleRight));
const nextMonthIcon = computed(() => props.nextMonthIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight));
const prevYearIcon = computed(() => props.prevYearIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleRight : appConfig.ui.icons.chevronDoubleLeft));
const prevMonthIcon = computed(() => props.prevMonthIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronRight : appConfig.ui.icons.chevronLeft));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.calendar || {} })({
  color: props.color,
  size: props.size
}));
function paginateYear(date, sign) {
  if (sign === -1) {
    return date.subtract({ years: 1 });
  }
  return date.add({ years: 1 });
}
const Calendar = computed(() => props.range ? RangeCalendar : SingleCalendar);
</script>

<template>
  <Calendar.Root
    v-slot="{ weekDays, grid }"
    v-bind="rootProps"
    :model-value="modelValue"
    :default-value="defaultValue"
    :locale="locale"
    :dir="dir"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <Calendar.Header :class="ui.header({ class: props.ui?.header })">
      <Calendar.Prev v-if="props.yearControls" :prev-page="(date) => paginateYear(date, -1)" :aria-label="t('calendar.prevYear')" as-child>
        <UButton :icon="prevYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevYear" />
      </Calendar.Prev>
      <Calendar.Prev v-if="props.monthControls" :aria-label="t('calendar.prevMonth')" as-child>
        <UButton :icon="prevMonthIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevMonth" />
      </Calendar.Prev>
      <Calendar.Heading v-slot="{ headingValue }" :class="ui.heading({ class: props.ui?.heading })">
        <slot name="heading" :value="headingValue">
          {{ headingValue }}
        </slot>
      </Calendar.Heading>
      <Calendar.Next v-if="props.monthControls" :aria-label="t('calendar.nextMonth')" as-child>
        <UButton :icon="nextMonthIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.nextMonth" />
      </Calendar.Next>
      <Calendar.Next v-if="props.yearControls" :next-page="(date) => paginateYear(date, 1)" :aria-label="t('calendar.nextYear')" as-child>
        <UButton :icon="nextYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.nextYear" />
      </Calendar.Next>
    </Calendar.Header>
    <div :class="ui.body({ class: props.ui?.body })">
      <Calendar.Grid
        v-for="month in grid"
        :key="month.value.toString()"
        :class="ui.grid({ class: props.ui?.grid })"
      >
        <Calendar.GridHead>
          <Calendar.GridRow :class="ui.gridWeekDaysRow({ class: props.ui?.gridWeekDaysRow })">
            <Calendar.HeadCell
              v-for="day in weekDays"
              :key="day"
              :class="ui.headCell({ class: props.ui?.headCell })"
            >
              <slot name="week-day" :day="day">
                {{ day }}
              </slot>
            </Calendar.HeadCell>
          </Calendar.GridRow>
        </Calendar.GridHead>
        <Calendar.GridBody :class="ui.gridBody({ class: props.ui?.gridBody })">
          <Calendar.GridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            :class="ui.gridRow({ class: props.ui?.gridRow })"
          >
            <Calendar.Cell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              :class="ui.cell({ class: props.ui?.cell })"
            >
              <Calendar.CellTrigger
                :day="weekDate"
                :month="month.value"
                :class="ui.cellTrigger({ class: props.ui?.cellTrigger })"
              >
                <slot name="day" :day="weekDate">
                  {{ weekDate.day }}
                </slot>
              </Calendar.CellTrigger>
            </Calendar.Cell>
          </Calendar.GridRow>
        </Calendar.GridBody>
      </Calendar.Grid>
    </div>
  </Calendar.Root>
</template>
