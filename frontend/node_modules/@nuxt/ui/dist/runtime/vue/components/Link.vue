<script>
import theme from "#build/ui/link";
</script>

<script setup>
import { computed } from "vue";
import { defu } from "defu";
import { isEqual } from "ohash/utils";
import { useForwardProps } from "reka-ui";
import { reactiveOmit } from "@vueuse/core";
import { hasProtocol } from "ufo";
import { useRoute, RouterLink } from "vue-router";
import { useAppConfig } from "#imports";
import { tv } from "../../utils/tv";
import { isPartiallyEqual } from "../../utils/link";
import ULinkBase from "../../components/LinkBase.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false, default: "button" },
  type: { type: null, required: false, default: "button" },
  disabled: { type: Boolean, required: false },
  active: { type: Boolean, required: false, default: void 0 },
  exact: { type: Boolean, required: false },
  exactQuery: { type: [Boolean, String], required: false },
  exactHash: { type: Boolean, required: false },
  inactiveClass: { type: String, required: false, default: "" },
  custom: { type: Boolean, required: false },
  raw: { type: Boolean, required: false },
  class: { type: null, required: false },
  to: { type: null, required: false },
  href: { type: null, required: false },
  external: { type: Boolean, required: false },
  target: { type: [String, Object, null], required: false },
  rel: { type: [String, Object, null], required: false },
  noRel: { type: Boolean, required: false },
  prefetchedClass: { type: String, required: false },
  prefetch: { type: Boolean, required: false },
  prefetchOn: { type: [String, Object], required: false },
  noPrefetch: { type: Boolean, required: false },
  activeClass: { type: String, required: false, default: "" },
  exactActiveClass: { type: String, required: false },
  ariaCurrentValue: { type: String, required: false, default: "page" },
  viewTransition: { type: Boolean, required: false },
  replace: { type: Boolean, required: false }
});
defineSlots();
const route = useRoute();
const appConfig = useAppConfig();
const routerLinkProps = useForwardProps(reactiveOmit(props, "as", "type", "disabled", "active", "exact", "exactQuery", "exactHash", "activeClass", "inactiveClass", "to", "href", "raw", "custom", "class"));
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
const to = computed(() => props.to ?? props.href);
const isExternal = computed(() => {
  if (props.external) {
    return true;
  }
  if (!to.value) {
    return false;
  }
  return typeof to.value === "string" && hasProtocol(to.value, { acceptRelative: true });
});
function isLinkActive({ route: linkRoute, isActive, isExactActive }) {
  if (props.active !== void 0) {
    return props.active;
  }
  if (!to.value) {
    return false;
  }
  if (props.exactQuery === "partial") {
    if (!isPartiallyEqual(linkRoute.query, route.query)) return false;
  } else if (props.exactQuery === true) {
    if (!isEqual(linkRoute.query, route.query)) return false;
  }
  if (props.exactHash && linkRoute.hash !== route.hash) {
    return false;
  }
  if (props.exact && isExactActive) {
    return true;
  }
  if (!props.exact && isActive) {
    return true;
  }
  return false;
}
function resolveLinkClass({ route: route2, isActive, isExactActive } = {}) {
  const active = isLinkActive({ route: route2, isActive, isExactActive });
  if (props.raw) {
    return [props.class, active ? props.activeClass : props.inactiveClass];
  }
  return ui.value({ class: props.class, active, disabled: props.disabled });
}
</script>

<template>
  <template v-if="!isExternal && !!to">
    <RouterLink v-slot="{ href, navigate, route: linkRoute, isActive, isExactActive }" v-bind="routerLinkProps" :to="to" custom>
      <template v-if="custom">
        <slot
          v-bind="{
  ...$attrs,
  ...exact && isExactActive ? { 'aria-current': props.ariaCurrentValue } : {},
  as,
  type,
  disabled,
  href,
  navigate,
  active: isLinkActive({ route: linkRoute, isActive, isExactActive })
}"
        />
      </template>
      <ULinkBase
        v-else
        v-bind="{
  ...$attrs,
  ...exact && isExactActive ? { 'aria-current': props.ariaCurrentValue } : {},
  as,
  type,
  disabled,
  href,
  navigate
}"
        :class="resolveLinkClass({ route: linkRoute, isActive, isExactActive })"
      >
        <slot :active="isLinkActive({ route: linkRoute, isActive, isExactActive })" />
      </ULinkBase>
    </RouterLink>
  </template>

  <template v-else>
    <template v-if="custom">
      <slot
        v-bind="{
  ...$attrs,
  as,
  type,
  disabled,
  href: to,
  target: isExternal ? '_blank' : void 0,
  active,
  isExternal
}"
      />
    </template>
    <ULinkBase
      v-else
      v-bind="{
  ...$attrs,
  as,
  type,
  disabled,
  href: to,
  target: isExternal ? '_blank' : void 0,
  isExternal
}"
      :class="resolveLinkClass()"
    >
      <slot :active="active" />
    </ULinkBase>
  </template>
</template>
