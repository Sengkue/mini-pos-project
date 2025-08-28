<script>
import theme from "#build/ui/textarea";
</script>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { Primitive } from "reka-ui";
import { useVModel } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentIcons } from "../composables/useComponentIcons";
import { useFormField } from "../composables/useFormField";
import { looseToNumber } from "../utils";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  id: { type: String, required: false },
  name: { type: String, required: false },
  placeholder: { type: String, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  required: { type: Boolean, required: false },
  autofocus: { type: Boolean, required: false },
  autofocusDelay: { type: Number, required: false, default: 0 },
  autoresize: { type: Boolean, required: false },
  autoresizeDelay: { type: Number, required: false, default: 0 },
  disabled: { type: Boolean, required: false },
  rows: { type: Number, required: false, default: 3 },
  maxrows: { type: Number, required: false, default: 0 },
  highlight: { type: Boolean, required: false },
  modelValue: { type: null, required: false },
  defaultValue: { type: null, required: false },
  modelModifiers: { type: Object, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  icon: { type: String, required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: String, required: false },
  trailing: { type: Boolean, required: false },
  trailingIcon: { type: String, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: String, required: false }
});
const emits = defineEmits(["update:modelValue", "blur", "change"]);
const slots = defineSlots();
const modelValue = useVModel(props, "modelValue", emits, { defaultValue: props.defaultValue });
const appConfig = useAppConfig();
const { emitFormFocus, emitFormBlur, emitFormInput, emitFormChange, size, color, id, name, highlight, disabled, ariaAttrs } = useFormField(props, { deferInputValidation: true });
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.textarea || {} })({
  color: color.value,
  variant: props.variant,
  size: size?.value,
  loading: props.loading,
  highlight: highlight.value,
  autoresize: props.autoresize,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing
}));
const textareaRef = ref(null);
function updateInput(value) {
  if (props.modelModifiers?.trim) {
    value = value?.trim() ?? null;
  }
  if (props.modelModifiers?.number) {
    value = looseToNumber(value);
  }
  if (props.modelModifiers?.nullify) {
    value ||= null;
  }
  modelValue.value = value;
  emitFormInput();
}
function onInput(event) {
  autoResize();
  if (!props.modelModifiers?.lazy) {
    updateInput(event.target.value);
  }
}
function onChange(event) {
  const value = event.target.value;
  if (props.modelModifiers?.lazy) {
    updateInput(value);
  }
  if (props.modelModifiers?.trim) {
    event.target.value = value.trim();
  }
  emitFormChange();
  emits("change", event);
}
function onBlur(event) {
  emitFormBlur();
  emits("blur", event);
}
function autoFocus() {
  if (props.autofocus) {
    textareaRef.value?.focus();
  }
}
function autoResize() {
  if (props.autoresize && textareaRef.value) {
    textareaRef.value.rows = props.rows;
    const overflow = textareaRef.value.style.overflow;
    textareaRef.value.style.overflow = "hidden";
    const styles = window.getComputedStyle(textareaRef.value);
    const paddingTop = Number.parseInt(styles.paddingTop);
    const paddingBottom = Number.parseInt(styles.paddingBottom);
    const padding = paddingTop + paddingBottom;
    const lineHeight = Number.parseInt(styles.lineHeight);
    const { scrollHeight } = textareaRef.value;
    const newRows = (scrollHeight - padding) / lineHeight;
    if (newRows > props.rows) {
      textareaRef.value.rows = props.maxrows ? Math.min(newRows, props.maxrows) : newRows;
    }
    textareaRef.value.style.overflow = overflow;
  }
}
watch(modelValue, () => {
  nextTick(autoResize);
});
onMounted(() => {
  setTimeout(() => {
    autoFocus();
  }, props.autofocusDelay);
  setTimeout(() => {
    autoResize();
  }, props.autoresizeDelay);
});
defineExpose({
  textareaRef
});
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <textarea
      :id="id"
      ref="textareaRef"
      :value="modelValue"
      :name="name"
      :rows="rows"
      :placeholder="placeholder"
      :class="ui.base({ class: props.ui?.base })"
      :disabled="disabled"
      :required="required"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
      @focus="emitFormFocus"
    />

    <slot />

    <span v-if="isLeading || !!avatar || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading">
        <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
        <UAvatar v-else-if="!!avatar" :size="props.ui?.leadingAvatarSize || ui.leadingAvatarSize()" v-bind="avatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
      <slot name="trailing">
        <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </slot>
    </span>
  </Primitive>
</template>
