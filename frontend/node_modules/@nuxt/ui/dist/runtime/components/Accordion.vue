<script>
import theme from "#build/ui/accordion";
</script>

<script setup>
import { computed } from "vue";
import { AccordionRoot, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent, useForwardPropsEmits } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { get } from "../utils";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
const props = defineProps({
  as: { type: null, required: false },
  items: { type: Array, required: false },
  trailingIcon: { type: String, required: false },
  labelKey: { type: String, required: false, default: "label" },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  collapsible: { type: Boolean, required: false, default: true },
  defaultValue: { type: null, required: false },
  modelValue: { type: null, required: false },
  type: { type: String, required: false, default: "single" },
  disabled: { type: Boolean, required: false },
  unmountOnHide: { type: Boolean, required: false, default: true }
});
const emits = defineEmits(["update:modelValue"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "collapsible", "defaultValue", "disabled", "modelValue", "type", "unmountOnHide"), emits);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.accordion || {} })({
  disabled: props.disabled
}));
</script>

<template>
  <AccordionRoot v-bind="rootProps" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <AccordionItem
      v-for="(item, index) in props.items"
      v-slot="{ open }"
      :key="index"
      :value="item.value || String(index)"
      :disabled="item.disabled"
      :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class] })"
    >
      <AccordionHeader as="div" :class="ui.header({ class: [props.ui?.header, item.ui?.header] })">
        <AccordionTrigger :class="ui.trigger({ class: [props.ui?.trigger, item.ui?.trigger], disabled: item.disabled })">
          <slot name="leading" :item="item" :index="index" :open="open">
            <UIcon v-if="item.icon" :name="item.icon" :class="ui.leadingIcon({ class: [props.ui?.leadingIcon, item?.ui?.leadingIcon] })" />
          </slot>

          <span v-if="get(item, props.labelKey) || !!slots.default" :class="ui.label({ class: [props.ui?.label, item.ui?.label] })">
            <slot :item="item" :index="index" :open="open">{{ get(item, props.labelKey) }}</slot>
          </span>

          <slot name="trailing" :item="item" :index="index" :open="open">
            <UIcon :name="item.trailingIcon || trailingIcon || appConfig.ui.icons.chevronDown" :class="ui.trailingIcon({ class: [props.ui?.trailingIcon, item.ui?.trailingIcon] })" />
          </slot>
        </AccordionTrigger>
      </AccordionHeader>

      <AccordionContent v-if="item.content || !!slots.content || item.slot && !!slots[item.slot] || !!slots.body || item.slot && !!slots[`${item.slot}-body`]" :class="ui.content({ class: [props.ui?.content, item.ui?.content] })">
        <slot :name="item.slot || 'content'" :item="item" :index="index" :open="open">
          <div :class="ui.body({ class: [props.ui?.body, item.ui?.body] })">
            <slot :name="item.slot ? `${item.slot}-body` : 'body'" :item="item" :index="index" :open="open">
              {{ item.content }}
            </slot>
          </div>
        </slot>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
