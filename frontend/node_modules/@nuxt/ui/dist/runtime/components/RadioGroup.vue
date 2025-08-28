<script>
import theme from "#build/ui/radio-group";
</script>

<script setup>
import { computed, useId } from "vue";
import { RadioGroupRoot, RadioGroupItem, RadioGroupIndicator, Label, useForwardPropsEmits } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useFormField } from "../composables/useFormField";
import { get } from "../utils";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false },
  legend: { type: String, required: false },
  valueKey: { type: String, required: false, default: "value" },
  labelKey: { type: String, required: false, default: "label" },
  descriptionKey: { type: String, required: false, default: "description" },
  items: { type: Array, required: false },
  size: { type: null, required: false },
  variant: { type: null, required: false },
  color: { type: null, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  indicator: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  defaultValue: { type: null, required: false },
  disabled: { type: Boolean, required: false },
  loop: { type: Boolean, required: false },
  modelValue: { type: null, required: false },
  name: { type: String, required: false },
  required: { type: Boolean, required: false }
});
const emits = defineEmits(["update:modelValue", "change"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "modelValue", "defaultValue", "orientation", "loop", "required"), emits);
const { emitFormChange, emitFormInput, color, name, size, id: _id, disabled, ariaAttrs } = useFormField(props, { bind: false });
const id = _id.value ?? useId();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.radioGroup || {} })({
  size: size.value,
  color: color.value,
  disabled: disabled.value,
  required: props.required,
  orientation: props.orientation,
  variant: props.variant,
  indicator: props.indicator
}));
function normalizeItem(item) {
  if (item === null) {
    return {
      id: `${id}:null`,
      value: void 0,
      label: void 0
    };
  }
  if (typeof item === "string" || typeof item === "number" || typeof item === "bigint") {
    return {
      id: `${id}:${item}`,
      value: String(item),
      label: String(item)
    };
  }
  const value = get(item, props.valueKey);
  const label = get(item, props.labelKey);
  const description = get(item, props.descriptionKey);
  return {
    ...item,
    value,
    label,
    description,
    id: `${id}:${value}`
  };
}
const normalizedItems = computed(() => {
  if (!props.items) {
    return [];
  }
  return props.items.map(normalizeItem);
});
function onUpdate(value) {
  const event = new Event("change", { target: { value } });
  emits("change", event);
  emitFormChange();
  emitFormInput();
}
</script>

<template>
  <RadioGroupRoot
    :id="id"
    v-slot="{ modelValue }"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:model-value="onUpdate"
  >
    <fieldset :class="ui.fieldset({ class: props.ui?.fieldset })" v-bind="ariaAttrs">
      <legend v-if="legend || !!slots.legend" :class="ui.legend({ class: props.ui?.legend })">
        <slot name="legend">
          {{ legend }}
        </slot>
      </legend>

      <component :is="!variant || variant === 'list' ? 'div' : Label" v-for="item in normalizedItems" :key="item.value" :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class] })">
        <div :class="ui.container({ class: [props.ui?.container, item.ui?.container] })">
          <RadioGroupItem
            :id="item.id"
            :value="item.value"
            :disabled="item.disabled"
            :class="ui.base({ class: [props.ui?.base, item.ui?.base], disabled: item.disabled })"
          >
            <RadioGroupIndicator :class="ui.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })" />
          </RadioGroupItem>
        </div>

        <div v-if="item.label || !!slots.label || (item.description || !!slots.description)" :class="ui.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] })">
          <component :is="!variant || variant === 'list' ? Label : 'p'" v-if="item.label || !!slots.label" :for="item.id" :class="ui.label({ class: [props.ui?.label, item.ui?.label] })">
            <slot name="label" :item="item" :model-value="modelValue">
              {{ item.label }}
            </slot>
          </component>
          <p v-if="item.description || !!slots.description" :class="ui.description({ class: [props.ui?.description, item.ui?.description] })">
            <slot name="description" :item="item" :model-value="modelValue">
              {{ item.description }}
            </slot>
          </p>
        </div>
      </component>
    </fieldset>
  </RadioGroupRoot>
</template>
