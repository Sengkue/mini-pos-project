<script>
import theme from "#build/ui/form";
</script>

<script setup>
import { provide, inject, nextTick, ref, onUnmounted, onMounted, computed, useId, readonly, reactive } from "vue";
import { useEventBus } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { formOptionsInjectionKey, formInputsInjectionKey, formBusInjectionKey, formLoadingInjectionKey } from "../composables/useFormField";
import { tv } from "../utils/tv";
import { validateSchema } from "../utils/form";
import { FormValidationException } from "../types/form";
const props = defineProps({
  id: { type: [String, Number], required: false },
  schema: { type: null, required: false },
  state: { type: Object, required: true },
  validate: { type: Function, required: false },
  validateOn: { type: Array, required: false, default() {
    return ["input", "blur", "change"];
  } },
  disabled: { type: Boolean, required: false },
  validateOnInputDelay: { type: Number, required: false, default: 300 },
  transform: { type: null, required: false, default: () => true },
  attach: { type: Boolean, required: false, default: true },
  loadingAuto: { type: Boolean, required: false, default: true },
  class: { type: null, required: false },
  onSubmit: { type: Function, required: false }
});
const emits = defineEmits(["submit", "error"]);
defineSlots();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.form || {} }));
const formId = props.id ?? useId();
const bus = useEventBus(`form-${formId}`);
const parentBus = props.attach && inject(
  formBusInjectionKey,
  void 0
);
provide(formBusInjectionKey, bus);
const nestedForms = ref(/* @__PURE__ */ new Map());
onMounted(async () => {
  bus.on(async (event) => {
    if (event.type === "attach") {
      nestedForms.value.set(event.formId, { validate: event.validate });
    } else if (event.type === "detach") {
      nestedForms.value.delete(event.formId);
    } else if (props.validateOn?.includes(event.type) && !loading.value) {
      if (event.type !== "input") {
        await _validate({ name: event.name, silent: true, nested: false });
      } else if (event.eager || blurredFields.has(event.name)) {
        await _validate({ name: event.name, silent: true, nested: false });
      }
    }
    if (event.type === "blur") {
      blurredFields.add(event.name);
    }
    if (event.type === "change" || event.type === "input" || event.type === "blur" || event.type === "focus") {
      touchedFields.add(event.name);
    }
    if (event.type === "change" || event.type === "input") {
      dirtyFields.add(event.name);
    }
  });
});
onUnmounted(() => {
  bus.reset();
});
onMounted(async () => {
  if (parentBus) {
    await nextTick();
    parentBus.emit({ type: "attach", validate: _validate, formId });
  }
});
onUnmounted(() => {
  if (parentBus) {
    parentBus.emit({ type: "detach", formId });
  }
});
const errors = ref([]);
provide("form-errors", errors);
const inputs = ref({});
provide(formInputsInjectionKey, inputs);
const dirtyFields = reactive(/* @__PURE__ */ new Set());
const touchedFields = reactive(/* @__PURE__ */ new Set());
const blurredFields = reactive(/* @__PURE__ */ new Set());
function resolveErrorIds(errs) {
  return errs.map((err) => ({
    ...err,
    id: err?.name ? inputs.value[err.name]?.id : void 0
  }));
}
const transformedState = ref(null);
async function getErrors() {
  let errs = props.validate ? await props.validate(props.state) ?? [] : [];
  if (props.schema) {
    const { errors: errors2, result } = await validateSchema(props.state, props.schema);
    if (errors2) {
      errs = errs.concat(errors2);
    } else {
      transformedState.value = result;
    }
  }
  return resolveErrorIds(errs);
}
async function _validate(opts = { silent: false, nested: true, transform: false }) {
  const names = opts.name && !Array.isArray(opts.name) ? [opts.name] : opts.name;
  const nestedValidatePromises = !names && opts.nested ? Array.from(nestedForms.value.values()).map(
    ({ validate }) => validate(opts).then(() => void 0).catch((error) => {
      if (!(error instanceof FormValidationException)) {
        throw error;
      }
      return error;
    })
  ) : [];
  if (names) {
    const otherErrors = errors.value.filter((error) => !names.some((name) => {
      const pattern = inputs.value?.[name]?.pattern;
      return name === error.name || pattern && error.name?.match(pattern);
    }));
    const pathErrors = (await getErrors()).filter((error) => names.some((name) => {
      const pattern = inputs.value?.[name]?.pattern;
      return name === error.name || pattern && error.name?.match(pattern);
    }));
    errors.value = otherErrors.concat(pathErrors);
  } else {
    errors.value = await getErrors();
  }
  const childErrors = (await Promise.all(nestedValidatePromises)).filter((val) => val !== void 0);
  if (errors.value.length + childErrors.length > 0) {
    if (opts.silent) return false;
    throw new FormValidationException(formId, errors.value, childErrors);
  }
  if (opts.transform) {
    Object.assign(props.state, transformedState.value);
  }
  return props.state;
}
const loading = ref(false);
provide(formLoadingInjectionKey, readonly(loading));
async function onSubmitWrapper(payload) {
  loading.value = props.loadingAuto && true;
  const event = payload;
  try {
    event.data = await _validate({ nested: true, transform: props.transform });
    await props.onSubmit?.(event);
    dirtyFields.clear();
  } catch (error) {
    if (!(error instanceof FormValidationException)) {
      throw error;
    }
    const errorEvent = {
      ...event,
      errors: error.errors,
      children: error.children
    };
    emits("error", errorEvent);
  } finally {
    loading.value = false;
  }
}
const disabled = computed(() => props.disabled || loading.value);
provide(formOptionsInjectionKey, computed(() => ({
  disabled: disabled.value,
  validateOnInputDelay: props.validateOnInputDelay
})));
defineExpose({
  validate: _validate,
  errors,
  setErrors(errs, name) {
    if (name) {
      errors.value = errors.value.filter((err) => name instanceof RegExp ? !(err.name && name.test(err.name)) : err.name !== name).concat(resolveErrorIds(errs));
    } else {
      errors.value = resolveErrorIds(errs);
    }
  },
  async submit() {
    await onSubmitWrapper(new Event("submit"));
  },
  getErrors(name) {
    if (name) {
      return errors.value.filter((err) => name instanceof RegExp ? err.name && name.test(err.name) : err.name === name);
    }
    return errors.value;
  },
  clear(name) {
    if (name) {
      errors.value = errors.value.filter((err) => name instanceof RegExp ? !(err.name && name.test(err.name)) : err.name !== name);
    } else {
      errors.value = [];
    }
  },
  disabled,
  loading,
  dirty: computed(() => !!dirtyFields.size),
  dirtyFields: readonly(dirtyFields),
  blurredFields: readonly(blurredFields),
  touchedFields: readonly(touchedFields)
});
</script>

<template>
  <component
    :is="parentBus ? 'div' : 'form'"
    :id="formId"
    :class="ui({ class: props.class })"
    @submit.prevent="onSubmitWrapper"
  >
    <slot :errors="errors" :loading="loading" />
  </component>
</template>
