<script>
import theme from "#build/ui/drawer";
</script>

<script setup>
import { computed, toRef } from "vue";
import { VisuallyHidden, useForwardPropsEmits } from "reka-ui";
import { DrawerRoot, DrawerRootNested, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerContent, DrawerTitle, DrawerDescription, DrawerHandle } from "vaul-vue";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { usePortal } from "../composables/usePortal";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  inset: { type: Boolean, required: false },
  content: { type: Object, required: false },
  overlay: { type: Boolean, required: false, default: true },
  handle: { type: Boolean, required: false, default: true },
  portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  nested: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  activeSnapPoint: { type: [Number, String, null], required: false },
  closeThreshold: { type: Number, required: false },
  shouldScaleBackground: { type: Boolean, required: false },
  setBackgroundColorOnScale: { type: Boolean, required: false },
  scrollLockTimeout: { type: Number, required: false },
  fixed: { type: Boolean, required: false },
  dismissible: { type: Boolean, required: false, default: true },
  modal: { type: Boolean, required: false, default: true },
  open: { type: Boolean, required: false },
  defaultOpen: { type: Boolean, required: false },
  direction: { type: String, required: false, default: "bottom" },
  noBodyStyles: { type: Boolean, required: false },
  handleOnly: { type: Boolean, required: false },
  preventScrollRestoration: { type: Boolean, required: false },
  snapPoints: { type: Array, required: false }
});
const emits = defineEmits(["drag", "release", "close", "update:open", "update:activeSnapPoint", "animationEnd"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const rootProps = useForwardPropsEmits(reactivePick(props, "activeSnapPoint", "closeThreshold", "shouldScaleBackground", "setBackgroundColorOnScale", "scrollLockTimeout", "fixed", "dismissible", "modal", "open", "defaultOpen", "nested", "direction", "noBodyStyles", "handleOnly", "preventScrollRestoration", "snapPoints"), emits);
const portalProps = usePortal(toRef(() => props.portal));
const contentProps = toRef(() => props.content);
const contentEvents = {
  closeAutoFocus: (e) => e.preventDefault()
};
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.drawer || {} })({
  direction: props.direction,
  inset: props.inset
}));
</script>

<template>
  <component :is="nested ? DrawerRootNested : DrawerRoot" v-bind="rootProps">
    <DrawerTrigger v-if="!!slots.default" as-child :class="props.class">
      <slot />
    </DrawerTrigger>

    <DrawerPortal v-bind="portalProps">
      <DrawerOverlay v-if="overlay" :class="ui.overlay({ class: props.ui?.overlay })" />

      <DrawerContent :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })" v-bind="contentProps" v-on="contentEvents">
        <DrawerHandle v-if="handle" :class="ui.handle({ class: props.ui?.handle })" />

        <VisuallyHidden v-if="!!slots.content && (title || !!slots.title || (description || !!slots.description))">
          <DrawerTitle v-if="title || !!slots.title">
            <slot name="title">
              {{ title }}
            </slot>
          </DrawerTitle>

          <DrawerDescription v-if="description || !!slots.description">
            <slot name="description">
              {{ description }}
            </slot>
          </DrawerDescription>
        </VisuallyHidden>

        <slot name="content">
          <div :class="ui.container({ class: props.ui?.container })">
            <div v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description)" :class="ui.header({ class: props.ui?.header })">
              <slot name="header">
                <DrawerTitle v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
                  <slot name="title">
                    {{ title }}
                  </slot>
                </DrawerTitle>

                <DrawerDescription v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
                  <slot name="description">
                    {{ description }}
                  </slot>
                </DrawerDescription>
              </slot>
            </div>

            <div v-if="!!slots.body" :class="ui.body({ class: props.ui?.body })">
              <slot name="body" />
            </div>

            <div v-if="!!slots.footer" :class="ui.footer({ class: props.ui?.footer })">
              <slot name="footer" />
            </div>
          </div>
        </slot>
      </DrawerContent>
    </DrawerPortal>
  </component>
</template>
