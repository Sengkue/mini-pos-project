<script>
import theme from "#build/ui/timeline";
</script>

<script setup>
import { computed } from "vue";
import { Primitive, Separator } from "reka-ui";
import { useAppConfig } from "#imports";
import { tv } from "../utils/tv";
import UAvatar from "./Avatar.vue";
const props = defineProps({
  as: { type: null, required: false },
  items: { type: Array, required: true },
  size: { type: null, required: false },
  color: { type: null, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  defaultValue: { type: [String, Number], required: false },
  reverse: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false }
});
const slots = defineSlots();
const modelValue = defineModel({ type: [String, Number] });
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.timeline || {} })({
  orientation: props.orientation,
  size: props.size,
  color: props.color,
  reverse: props.reverse
}));
const currentStepIndex = computed(() => {
  const value = modelValue.value ?? props.defaultValue;
  if (typeof value === "string") {
    return props.items.findIndex((item) => item.value === value) ?? -1;
  }
  if (props.reverse) {
    return value != null ? props.items.length - 1 - value : -1;
  } else {
    return value ?? -1;
  }
});
function getItemState(index) {
  if (currentStepIndex.value === -1) return void 0;
  if (index === currentStepIndex.value) return "active";
  if (props.reverse) {
    return index > currentStepIndex.value ? "completed" : void 0;
  } else {
    return index < currentStepIndex.value ? "completed" : void 0;
  }
}
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div
      v-for="(item, index) in items"
      :key="item.value ?? index"
      :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class] })"
      :data-state="getItemState(index)"
    >
      <div :class="ui.container({ class: [props.ui?.container, item.ui?.container] })">
        <UAvatar :size="size" :icon="item.icon" v-bind="typeof item.avatar === 'object' ? item.avatar : {}" :class="ui.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })" :ui="{ icon: 'text-inherit', fallback: 'text-inherit' }">
          <slot :name="item.slot ? `${item.slot}-indicator` : 'indicator'" :item="item" />
        </UAvatar>

        <Separator
          v-if="index < items.length - 1"
          :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator] })"
          :orientation="props.orientation"
        />
      </div>

      <div :class="ui.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] })">
        <div v-if="item.date" :class="ui.date({ class: [props.ui?.date, item.ui?.date] })">
          <slot :name="item.slot ? `${item.slot}-date` : 'date'" :item="item">
            {{ item.date }}
          </slot>
        </div>
        <div v-if="item.title || !!slots.title" :class="ui.title({ class: [props.ui?.title, item.ui?.title] })">
          <slot :name="item.slot ? `${item.slot}-title` : 'title'" :item="item">
            {{ item.title }}
          </slot>
        </div>
        <div v-if="item.description || !!slots.description" :class="ui.description({ class: [props.ui?.description, item.ui?.description] })">
          <slot :name="item.slot ? `${item.slot}-description` : 'description'" :item="item">
            {{ item.description }}
          </slot>
        </div>
      </div>
    </div>
  </Primitive>
</template>
