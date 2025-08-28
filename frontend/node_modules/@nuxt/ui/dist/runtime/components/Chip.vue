<script>
import theme from "#build/ui/chip";
</script>

<script setup>
import { computed } from "vue";
import { Primitive, Slot } from "reka-ui";
import { useAppConfig } from "#imports";
import { useAvatarGroup } from "../composables/useAvatarGroup";
import { tv } from "../utils/tv";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  text: { type: [String, Number], required: false },
  color: { type: null, required: false },
  size: { type: null, required: false },
  position: { type: null, required: false },
  inset: { type: Boolean, required: false, default: false },
  standalone: { type: Boolean, required: false, default: false },
  class: { type: null, required: false },
  ui: { type: null, required: false }
});
defineSlots();
const show = defineModel("show", { type: Boolean, ...{ default: true } });
const { size } = useAvatarGroup(props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chip || {} })({
  color: props.color,
  size: size.value,
  position: props.position,
  inset: props.inset,
  standalone: props.standalone
}));
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <Slot v-bind="$attrs">
      <slot />
    </Slot>

    <span v-if="show" :class="ui.base({ class: props.ui?.base })">
      <slot name="content">
        {{ text }}
      </slot>
    </span>
  </Primitive>
</template>
