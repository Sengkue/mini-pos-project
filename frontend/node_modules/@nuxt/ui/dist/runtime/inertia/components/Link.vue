<script>
import theme from "#build/ui/link";
</script>

<script setup>
import { computed } from "vue";
import { defu } from "defu";
import { useForwardProps } from "reka-ui";
import { reactiveOmit } from "@vueuse/core";
import { usePage } from "@inertiajs/vue3";
import { hasProtocol } from "ufo";
import { useAppConfig } from "#imports";
import { tv } from "../../utils/tv";
import ULinkBase from "../../components/LinkBase.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false, default: "button" },
  type: { type: null, required: false, default: "button" },
  disabled: { type: Boolean, required: false },
  active: { type: Boolean, required: false, default: void 0 },
  exact: { type: Boolean, required: false },
  inactiveClass: { type: String, required: false, default: "" },
  custom: { type: Boolean, required: false },
  raw: { type: Boolean, required: false },
  class: { type: null, required: false },
  activeClass: { type: String, required: false, default: "" },
  to: { type: String, required: false },
  href: { type: String, required: false },
  external: { type: Boolean, required: false },
  target: { type: [String, Object, null], required: false },
  ariaCurrentValue: { type: String, required: false },
  data: { type: Object, required: false },
  method: { type: String, required: false },
  headers: { type: Object, required: false },
  preserveScroll: { type: [Boolean, String, Function], required: false },
  preserveState: { type: [Boolean, String, Function], required: false },
  replace: { type: Boolean, required: false },
  only: { type: Array, required: false },
  except: { type: Array, required: false },
  onCancelToken: { type: Function, required: false },
  onBefore: { type: Function, required: false },
  onStart: { type: Function, required: false },
  onProgress: { type: Function, required: false },
  onFinish: { type: Function, required: false },
  onCancel: { type: Function, required: false },
  onSuccess: { type: Function, required: false },
  onError: { type: Function, required: false },
  queryStringArrayFormat: { type: String, required: false },
  async: { type: Boolean, required: false },
  prefetch: { type: [Boolean, String, Array], required: false },
  cacheFor: { type: [Number, String, Array], required: false }
});
defineSlots();
const page = usePage();
const appConfig = useAppConfig();
const routerLinkProps = useForwardProps(reactiveOmit(props, "as", "type", "disabled", "active", "exact", "activeClass", "inactiveClass", "to", "href", "raw", "custom", "class"));
const ui = computed(() => tv({
  extend: tv(theme),
  ...defu({
    variants: {
      active: {
        true: props.activeClass,
        false: props.inactiveClass
      }
    }
  }, appConfig.ui?.link || {})
}));
const href = computed(() => props.to ?? props.href);
const isExternal = computed(() => {
  if (props.external) {
    return true;
  }
  if (!href.value) {
    return false;
  }
  return typeof href.value === "string" && hasProtocol(href.value, { acceptRelative: true });
});
const isLinkActive = computed(() => {
  if (props.active !== void 0) {
    return props.active;
  }
  if (!href.value) {
    return false;
  }
  if (props.exact && page.url === href.value) {
    return true;
  }
  if (!props.exact && page.url.startsWith(href.value)) {
    return true;
  }
  return false;
});
const linkClass = computed(() => {
  const active = isLinkActive.value;
  if (props.raw) {
    return [props.class, active ? props.activeClass : props.inactiveClass];
  }
  return ui.value({ class: props.class, active, disabled: props.disabled });
});
</script>

<template>
  <template v-if="custom">
    <slot
      v-bind="{
  ...$attrs,
  ...routerLinkProps,
  as,
  type,
  disabled,
  href,
  active: isLinkActive,
  isExternal
}"
    />
  </template>
  <ULinkBase
    v-else
    v-bind="{
  ...$attrs,
  ...routerLinkProps,
  as,
  type,
  disabled,
  href,
  isExternal
}"
    :class="linkClass"
  >
    <slot :active="isLinkActive" />
  </ULinkBase>
</template>
