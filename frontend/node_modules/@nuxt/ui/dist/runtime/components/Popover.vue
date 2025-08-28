<script>
import theme from "#build/ui/popover";
</script>

<script setup>
import { computed, toRef } from "vue";
import { defu } from "defu";
import { useForwardPropsEmits } from "reka-ui";
import { Popover, HoverCard } from "reka-ui/namespaced";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { usePortal } from "../composables/usePortal";
import { tv } from "../utils/tv";
const props = defineProps({
  mode: { type: String, required: false, default: "click" },
  content: { type: Object, required: false },
  arrow: { type: [Boolean, Object], required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  reference: { type: null, required: false },
  dismissible: { type: Boolean, required: false, default: true },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  defaultOpen: { type: Boolean, required: false },
  open: { type: Boolean, required: false },
  modal: { type: Boolean, required: false },
  openDelay: { type: Number, required: false, default: 0 },
  closeDelay: { type: Number, required: false, default: 0 }
});
const emits = defineEmits(["close:prevent", "update:open"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const pick = props.mode === "hover" ? reactivePick(props, "defaultOpen", "open", "openDelay", "closeDelay") : reactivePick(props, "defaultOpen", "open", "modal");
const rootProps = useForwardPropsEmits(pick, emits);
const portalProps = usePortal(toRef(() => props.portal));
const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8 }));
const contentEvents = computed(() => {
  if (!props.dismissible) {
    const events = ["pointerDownOutside", "interactOutside", "escapeKeyDown"];
    return events.reduce((acc, curr) => {
      acc[curr] = (e) => {
        e.preventDefault();
        emits("close:prevent");
      };
      return acc;
    }, {});
  }
  return {};
});
const arrowProps = toRef(() => props.arrow);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.popover || {} })({
  side: contentProps.value.side
}));
const Component = computed(() => props.mode === "hover" ? HoverCard : Popover);
</script>

<template>
  <Component.Root v-slot="{ open }" v-bind="rootProps">
    <Component.Trigger v-if="!!slots.default || !!reference" as-child :reference="reference" :class="props.class">
      <slot :open="open" />
    </Component.Trigger>

    <Component.Anchor v-if="'Anchor' in Component && !!slots.anchor" as-child>
      <slot name="anchor" />
    </Component.Anchor>

    <Component.Portal v-bind="portalProps">
      <Component.Content v-bind="contentProps" :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })" v-on="contentEvents">
        <slot name="content" />

        <Component.Arrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow({ class: props.ui?.arrow })" />
      </Component.Content>
    </Component.Portal>
  </Component.Root>
</template>
