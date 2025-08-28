<script>
import theme from "#build/ui/checkbox";
</script>

<script setup>
import { computed, useId } from "vue";
import { Primitive, CheckboxRoot, CheckboxIndicator, Label, useForwardProps } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useFormField } from "../composables/useFormField";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  label: { type: String, required: false },
  description: { type: String, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  indicator: { type: null, required: false },
  icon: { type: String, required: false },
  indeterminateIcon: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  disabled: { type: Boolean, required: false },
  required: { type: Boolean, required: false },
  name: { type: String, required: false },
  value: { type: null, required: false },
  id: { type: String, required: false },
  defaultValue: { type: [Boolean, String], required: false }
});
const slots = defineSlots();
const emits = defineEmits(["change"]);
const modelValue = defineModel({ type: [Boolean, String], ...{ default: void 0 } });
const appConfig = useAppConfig();
const rootProps = useForwardProps(reactivePick(props, "required", "value", "defaultValue"));
const { id: _id, emitFormChange, emitFormInput, size, color, name, disabled, ariaAttrs } = useFormField(props);
const id = _id.value ?? useId();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.checkbox || {} })({
  size: size.value,
  color: color.value,
  variant: props.variant,
  indicator: props.indicator,
  required: props.required,
  disabled: disabled.value
}));
function onUpdate(value) {
  const event = new Event("change", { target: { value } });
  emits("change", event);
  emitFormChange();
  emitFormInput();
}
</script>

<template>
  <Primitive :as="!variant || variant === 'list' ? as : Label" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.container({ class: props.ui?.container })">
      <CheckboxRoot
        :id="id"
        v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
        v-model="modelValue"
        :name="name"
        :disabled="disabled"
        :class="ui.base({ class: props.ui?.base })"
        @update:model-value="onUpdate"
      >
        <template #default="{ modelValue }">
          <CheckboxIndicator :class="ui.indicator({ class: props.ui?.indicator })">
            <UIcon v-if="modelValue === 'indeterminate'" :name="indeterminateIcon || appConfig.ui.icons.minus" :class="ui.icon({ class: props.ui?.icon })" />
            <UIcon v-else :name="icon || appConfig.ui.icons.check" :class="ui.icon({ class: props.ui?.icon })" />
          </CheckboxIndicator>
        </template>
      </CheckboxRoot>
    </div>

    <div v-if="label || !!slots.label || (description || !!slots.description)" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <component :is="!variant || variant === 'list' ? Label : 'p'" v-if="label || !!slots.label" :for="id" :class="ui.label({ class: props.ui?.label })">
        <slot name="label" :label="label">
          {{ label }}
        </slot>
      </component>
      <p v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description" :description="description">
          {{ description }}
        </slot>
      </p>
    </div>
  </Primitive>
</template>
