<script>
import theme from "#build/ui/tree";
</script>

<script setup>
import { computed } from "vue";
import { TreeRoot, TreeItem, useForwardPropsEmits } from "reka-ui";
import { reactivePick, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { get } from "../utils";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  color: { type: null, required: false },
  size: { type: null, required: false },
  valueKey: { type: null, required: false, default: "value" },
  labelKey: { type: null, required: false, default: "label" },
  trailingIcon: { type: String, required: false },
  expandedIcon: { type: String, required: false },
  collapsedIcon: { type: String, required: false },
  items: { type: null, required: false },
  modelValue: { type: null, required: false },
  defaultValue: { type: null, required: false },
  multiple: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  expanded: { type: Array, required: false },
  defaultExpanded: { type: Array, required: false },
  selectionBehavior: { type: String, required: false },
  propagateSelect: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  bubbleSelect: { type: Boolean, required: false }
});
const emits = defineEmits(["update:expanded", "update:modelValue"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "modelValue", "defaultValue", "items", "multiple", "expanded", "disabled", "propagateSelect", "bubbleSelect"), emits);
const [DefineTreeTemplate, ReuseTreeTemplate] = createReusableTemplate();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.tree || {} })({
  color: props.color,
  size: props.size
}));
function getItemLabel(item) {
  return get(item, props.labelKey);
}
function getItemValue(item) {
  return get(item, props.valueKey) ?? get(item, props.labelKey);
}
function getDefaultOpenedItems(item) {
  const currentItem = item.defaultExpanded ? getItemValue(item) : null;
  const childItems = item.children?.flatMap((child) => getDefaultOpenedItems(child)) ?? [];
  return [currentItem, ...childItems].filter(Boolean);
}
const defaultExpanded = computed(
  () => props.defaultExpanded ?? props.items?.flatMap((item) => getDefaultOpenedItems(item))
);
</script>

<template>
  <DefineTreeTemplate v-slot="{ items, level }">
    <li
      v-for="(item, index) in items"
      :key="`${level}-${index}`"
      :class="level > 0 ? ui.itemWithChildren({ class: [props.ui?.itemWithChildren, item.ui?.itemWithChildren] }) : ui.item({ class: [props.ui?.item, item.ui?.item] })"
    >
      <TreeItem
        v-slot="{ isExpanded, isSelected }"
        as-child
        :level="level"
        :value="item"
        @toggle="item.onToggle"
        @select="item.onSelect"
      >
        <slot :name="item.slot ? `${item.slot}-wrapper` : 'item-wrapper'" v-bind="{ item, index, level, expanded: isExpanded, selected: isSelected }" :item="item">
          <button type="button" :disabled="item.disabled || disabled" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], selected: isSelected, disabled: item.disabled || disabled })">
            <slot :name="item.slot || 'item'" v-bind="{ index, level, expanded: isExpanded, selected: isSelected }" :item="item">
              <slot :name="item.slot ? `${item.slot}-leading` : 'item-leading'" v-bind="{ index, level, expanded: isExpanded, selected: isSelected }" :item="item">
                <UIcon
                  v-if="item.icon"
                  :name="item.icon"
                  :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon] })"
                />
                <UIcon
                  v-else-if="item.children?.length"
                  :name="isExpanded ? expandedIcon ?? appConfig.ui.icons.folderOpen : collapsedIcon ?? appConfig.ui.icons.folder"
                  :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon] })"
                />
              </slot>

              <span v-if="getItemLabel(item) || !!slots[item.slot ? `${item.slot}-label` : 'item-label']" :class="ui.linkLabel({ class: [props.ui?.linkLabel, item.ui?.linkLabel] })">
                <slot :name="item.slot ? `${item.slot}-label` : 'item-label'" v-bind="{ item, index, level, expanded: isExpanded, selected: isSelected }" :item="item">
                  {{ getItemLabel(item) }}
                </slot>
              </span>

              <span v-if="item.trailingIcon || item.children?.length || !!slots[item.slot ? `${item.slot}-trailing` : 'item-trailing']" :class="ui.linkTrailing({ class: [props.ui?.linkTrailing, item.ui?.linkTrailing] })">
                <slot :name="item.slot ? `${item.slot}-trailing` : 'item-trailing'" v-bind="{ item, index, level, expanded: isExpanded, selected: isSelected }" :item="item">
                  <UIcon v-if="item.trailingIcon" :name="item.trailingIcon" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon] })" />
                  <UIcon v-else-if="item.children?.length" :name="trailingIcon ?? appConfig.ui.icons.chevronDown" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon] })" />
                </slot>
              </span>
            </slot>
          </button>
        </slot>

        <ul v-if="item.children?.length && isExpanded" :class="ui.listWithChildren({ class: [props.ui?.listWithChildren, item.ui?.listWithChildren] })">
          <ReuseTreeTemplate :items="item.children" :level="level + 1" />
        </ul>
      </TreeItem>
    </li>
  </DefineTreeTemplate>

  <TreeRoot
    v-bind="{ ...rootProps, ...$attrs }"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :get-key="getItemValue"
    :default-expanded="defaultExpanded"
    :selection-behavior="selectionBehavior"
  >
    <ReuseTreeTemplate :items="items" :level="0" />
  </TreeRoot>
</template>
