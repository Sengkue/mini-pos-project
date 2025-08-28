<script>
import theme from "#build/ui/file-upload";
</script>

<script setup>
import { computed, watch } from "vue";
import { Primitive } from "reka-ui";
import { createReusableTemplate } from "@vueuse/core";
import { useAppConfig, useLocale } from "#imports";
import { useFormField } from "../composables/useFormField";
import { useFileUpload } from "../composables/useFileUpload";
import { tv } from "../utils/tv";
import UAvatar from "./Avatar.vue";
import UButton from "./Button.vue";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  id: { type: String, required: false },
  name: { type: String, required: false },
  icon: { type: String, required: false },
  label: { type: String, required: false },
  description: { type: String, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  layout: { type: null, required: false, default: "grid" },
  position: { type: null, required: false, default: "outside" },
  highlight: { type: Boolean, required: false },
  accept: { type: String, required: false, default: "*" },
  multiple: { type: Boolean, required: false, default: false },
  reset: { type: Boolean, required: false, default: false },
  dropzone: { type: Boolean, required: false, default: true },
  interactive: { type: Boolean, required: false, default: true },
  required: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  fileIcon: { type: String, required: false },
  fileDelete: { type: [Boolean, Object], required: false },
  fileDeleteIcon: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false }
});
const emits = defineEmits(["update:modelValue", "change"]);
const slots = defineSlots();
const modelValue = defineModel({ type: null });
const appConfig = useAppConfig();
const { t } = useLocale();
const [DefineFilesTemplate, ReuseFilesTemplate] = createReusableTemplate();
const { isDragging, open, inputRef, dropzoneRef } = useFileUpload({
  accept: props.accept,
  reset: props.reset,
  multiple: props.multiple,
  dropzone: props.dropzone,
  onUpdate
});
const { emitFormInput, emitFormChange, id, name, disabled, ariaAttrs } = useFormField(props);
const variant = computed(() => props.multiple ? "area" : props.variant);
const layout = computed(() => props.variant === "button" && !props.multiple ? "grid" : props.layout);
const position = computed(() => {
  if (layout.value === "grid" && props.multiple) {
    return "inside";
  }
  if (variant.value === "button") {
    return "outside";
  }
  return props.position;
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.fileUpload || {} })({
  dropzone: props.dropzone,
  interactive: props.interactive,
  color: props.color,
  size: props.size,
  variant: variant.value,
  layout: layout.value,
  position: position.value,
  multiple: props.multiple,
  highlight: props.highlight,
  disabled: props.disabled
}));
function createObjectUrl(file) {
  return URL.createObjectURL(file);
}
function formatFileSize(bytes) {
  if (bytes === 0) {
    return "0B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  const formattedSize = i === 0 ? size.toString() : size.toFixed(0);
  return `${formattedSize}${sizes[i]}`;
}
function onUpdate(files, reset = false) {
  if (props.multiple) {
    if (reset) {
      modelValue.value = files;
    } else {
      const existingFiles = modelValue.value || [];
      modelValue.value = [...existingFiles, ...files || []];
    }
  } else {
    modelValue.value = files?.[0];
  }
  const event = new Event("change", { target: { value: modelValue.value } });
  emits("change", event);
  emitFormChange();
  emitFormInput();
}
function removeFile(index) {
  if (!modelValue.value) {
    return;
  }
  if (!props.multiple || index === void 0) {
    onUpdate([], true);
    dropzoneRef.value?.focus();
    return;
  }
  const files = [...modelValue.value];
  files.splice(index, 1);
  onUpdate(files, true);
  dropzoneRef.value?.focus();
}
watch(modelValue, (newValue) => {
  const hasModelReset = !Array.isArray(newValue) || !newValue.length;
  if (hasModelReset && inputRef.value) {
    inputRef.value.value = "";
  }
});
defineExpose({
  inputRef,
  dropzoneRef
});
</script>

<template>
  <DefineFilesTemplate>
    <template v-if="modelValue && (Array.isArray(modelValue) ? modelValue.length : true)">
      <slot name="files-top" :files="modelValue" :open="open" :remove-file="removeFile" />

      <div :class="ui.files({ class: props.ui?.files })">
        <slot name="files" :files="modelValue">
          <div v-for="(file, index) in Array.isArray(modelValue) ? modelValue : [modelValue]" :key="file.name" :class="ui.file({ class: props.ui?.file })">
            <slot name="file" :file="file" :index="index">
              <slot name="file-leading" :file="file" :index="index">
                <UAvatar :src="createObjectUrl(file)" :icon="fileIcon || appConfig.ui.icons.file" :size="props.size" :class="ui.fileLeadingAvatar({ class: props.ui?.fileLeadingAvatar })" />
              </slot>

              <div :class="ui.fileWrapper({ class: props.ui?.fileWrapper })">
                <span :class="ui.fileName({ class: props.ui?.fileName })">
                  <slot name="file-name" :file="file" :index="index">
                    {{ file.name }}
                  </slot>
                </span>

                <span :class="ui.fileSize({ class: props.ui?.fileSize })">
                  <slot name="file-size" :file="file" :index="index">
                    {{ formatFileSize(file.size) }}
                  </slot>
                </span>
              </div>

              <slot name="file-trailing" :file="file" :index="index">
                <UButton
                  color="neutral"
                  v-bind="{
  ...layout === 'grid' ? {
    variant: 'solid',
    size: 'xs'
  } : {
    variant: 'link',
    size
  },
  ...typeof fileDelete === 'object' ? fileDelete : void 0
}"
                  :aria-label="t('fileUpload.removeFile', { filename: file.name })"
                  :trailing-icon="fileDeleteIcon || appConfig.ui.icons.close"
                  :class="ui.fileTrailingButton({ class: props.ui?.fileTrailingButton })"
                  @click.stop.prevent="removeFile(index)"
                />
              </slot>
            </slot>
          </div>
        </slot>
      </div>

      <slot name="files-bottom" :files="modelValue" :open="open" :remove-file="removeFile" />
    </template>
  </DefineFilesTemplate>

  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot :open="open" :remove-file="removeFile">
      <component
        :is="variant === 'button' ? 'button' : 'div'"
        ref="dropzoneRef"
        :role="variant === 'button' ? void 0 : 'button'"
        :data-dragging="isDragging"
        :class="ui.base({ class: props.ui?.base })"
        :tabindex="interactive && !disabled ? 0 : -1"
        @click="interactive && !disabled && open()"
        @keydown.prevent
        @keyup.enter.space="interactive && !disabled && open()"
      >
        <ReuseFilesTemplate v-if="position === 'inside'" />

        <div v-if="position === 'inside' ? multiple ? !modelValue?.length : !modelValue : true" :class="ui.wrapper({ class: props.ui?.wrapper })">
          <slot name="leading">
            <UIcon v-if="variant === 'button'" :name="icon || appConfig.ui.icons.upload" :class="ui.icon({ class: props.ui?.icon })" />
            <UAvatar v-else :icon="icon || appConfig.ui.icons.upload" :size="props.size" :class="ui.avatar({ class: props.ui?.avatar })" />
          </slot>

          <template v-if="variant !== 'button'">
            <div v-if="label || !!slots.label" :class="ui.label({ class: props.ui?.label })">
              <slot name="label">
                {{ label }}
              </slot>
            </div>
            <div v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
              <slot name="description">
                {{ description }}
              </slot>
            </div>

            <div v-if="!!slots.actions" :class="ui.actions({ class: props.ui?.actions })">
              <slot name="actions" :files="modelValue" :open="open" :remove-file="removeFile" />
            </div>
          </template>
        </div>
      </component>

      <ReuseFilesTemplate v-if="position === 'outside'" />
    </slot>

    <input
      :id="id"
      ref="inputRef"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      :required="required"
      :disabled="disabled"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      class="sr-only"
      tabindex="-1"
    >
  </Primitive>
</template>
