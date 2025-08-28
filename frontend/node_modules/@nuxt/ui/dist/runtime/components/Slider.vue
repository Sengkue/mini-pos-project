<script>
import theme from "#build/ui/slider";
</script>

<script setup>
import { computed } from "vue";
import { SliderRoot, SliderRange, SliderTrack, SliderThumb, useForwardPropsEmits } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useFormField } from "../composables/useFormField";
import { tv } from "../utils/tv";
import UTooltip from "./Tooltip.vue";
const props = defineProps({
  as: { type: null, required: false },
  size: { type: null, required: false },
  color: { type: null, required: false },
  orientation: { type: null, required: false, default: "horizontal" },
  tooltip: { type: [Boolean, Object], required: false },
  defaultValue: { type: [Number, Array], required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  name: { type: String, required: false },
  disabled: { type: Boolean, required: false },
  inverted: { type: Boolean, required: false },
  min: { type: Number, required: false, default: 0 },
  max: { type: Number, required: false, default: 100 },
  step: { type: Number, required: false, default: 1 },
  minStepsBetweenThumbs: { type: Number, required: false }
});
const emits = defineEmits(["update:modelValue", "change"]);
const modelValue = defineModel({ type: null });
const appConfig = useAppConfig();
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "orientation", "min", "max", "step", "minStepsBetweenThumbs", "inverted"), emits);
const { id, emitFormChange, emitFormInput, size, color, name, disabled, ariaAttrs } = useFormField(props);
const defaultSliderValue = computed(() => {
  if (typeof props.defaultValue === "number") {
    return [props.defaultValue];
  }
  return props.defaultValue;
});
const sliderValue = computed({
  get() {
    if (typeof modelValue.value === "number") {
      return [modelValue.value];
    }
    return modelValue.value ?? defaultSliderValue.value;
  },
  set(value) {
    modelValue.value = value?.length !== 1 ? value : value[0];
  }
});
const thumbs = computed(() => sliderValue.value?.length ?? 1);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.slider || {} })({
  disabled: disabled.value,
  size: size.value,
  color: color.value,
  orientation: props.orientation
}));
function onChange(value) {
  const event = new Event("change", { target: { value } });
  emits("change", event);
  emitFormChange();
}
</script>

<template>
  <SliderRoot
    v-bind="{ ...rootProps, ...ariaAttrs }"
    :id="id"
    v-model="sliderValue"
    :name="name"
    :disabled="disabled"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :default-value="defaultSliderValue"
    @update:model-value="emitFormInput()"
    @value-commit="onChange"
  >
    <SliderTrack :class="ui.track({ class: props.ui?.track })">
      <SliderRange :class="ui.range({ class: props.ui?.range })" />
    </SliderTrack>

    <template v-for="thumb in thumbs" :key="thumb">
      <UTooltip
        v-if="!!tooltip"
        :text="thumbs > 1 ? String(sliderValue?.[thumb - 1]) : String(sliderValue)"
        disable-closing-trigger
        v-bind="typeof tooltip === 'object' ? tooltip : {}"
      >
        <SliderThumb :class="ui.thumb({ class: props.ui?.thumb })" />
      </UTooltip>
      <SliderThumb v-else :class="ui.thumb({ class: props.ui?.thumb })" />
    </template>
  </SliderRoot>
</template>
