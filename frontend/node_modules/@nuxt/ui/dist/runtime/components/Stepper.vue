<script>
import theme from "#build/ui/stepper";
</script>

<script setup>
import { computed } from "vue";
import { StepperRoot, StepperItem, StepperTrigger, StepperIndicator, StepperSeparator, StepperTitle, StepperDescription, useForwardProps } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
const props = defineProps({
  as: { type: null, required: false },
  items: { type: Array, required: true },
  size: { type: null, required: false },
  color: { type: null, required: false },
  orientation: { type: null, required: false, default: "horizontal" },
  defaultValue: { type: [String, Number], required: false },
  disabled: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  linear: { type: Boolean, required: false, default: true }
});
const emits = defineEmits(["next", "prev"]);
const slots = defineSlots();
const modelValue = defineModel({ type: [String, Number] });
const appConfig = useAppConfig();
const rootProps = useForwardProps(reactivePick(props, "as", "orientation", "linear"));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.stepper || {} })({
  orientation: props.orientation,
  size: props.size,
  color: props.color
}));
const currentStepIndex = computed({
  get() {
    const value = modelValue.value ?? props.defaultValue;
    return (typeof value === "string" ? props.items.findIndex((item) => item.value === value) : value) ?? 0;
  },
  set(value) {
    modelValue.value = props.items?.[value]?.value ?? value;
  }
});
const currentStep = computed(() => props.items?.[currentStepIndex.value]);
const hasNext = computed(() => currentStepIndex.value < props.items?.length - 1);
const hasPrev = computed(() => currentStepIndex.value > 0);
defineExpose({
  next() {
    if (hasNext.value) {
      currentStepIndex.value += 1;
      emits("next", currentStep.value);
    }
  },
  prev() {
    if (hasPrev.value) {
      currentStepIndex.value -= 1;
      emits("prev", currentStep.value);
    }
  },
  hasNext,
  hasPrev
});
</script>

<template>
  <StepperRoot v-bind="rootProps" v-model="currentStepIndex" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.header({ class: props.ui?.header })">
      <StepperItem
        v-for="(item, count) in items"
        :key="item.value ?? count"
        :step="count"
        :disabled="item.disabled || props.disabled"
        :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class] })"
      >
        <div :class="ui.container({ class: [props.ui?.container, item.ui?.container] })">
          <StepperTrigger :class="ui.trigger({ class: [props.ui?.trigger, item.ui?.trigger] })">
            <StepperIndicator :class="ui.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })">
              <slot name="indicator" :item="item">
                <UIcon v-if="item.icon" :name="item.icon" :class="ui.icon({ class: [props.ui?.icon, item.ui?.icon] })" />
                <template v-else>
                  {{ count + 1 }}
                </template>
              </slot>
            </StepperIndicator>
          </StepperTrigger>

          <StepperSeparator
            v-if="count < items.length - 1"
            :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator] })"
          />
        </div>

        <div :class="ui.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] })">
          <StepperTitle as="div" :class="ui.title({ class: [props.ui?.title, item.ui?.title] })">
            <slot name="title" :item="item">
              {{ item.title }}
            </slot>
          </StepperTitle>
          <StepperDescription as="div" :class="ui.description({ class: [props.ui?.description, item.ui?.description] })">
            <slot name="description" :item="item">
              {{ item.description }}
            </slot>
          </StepperDescription>
        </div>
      </StepperItem>
    </div>

    <div v-if="currentStep?.content || !!slots.content || currentStep?.slot" :class="ui.content({ class: props.ui?.content })">
      <slot
        :name="currentStep?.slot || 'content'"
        :item="currentStep"
      >
        {{ currentStep?.content }}
      </slot>
    </div>
  </StepperRoot>
</template>
