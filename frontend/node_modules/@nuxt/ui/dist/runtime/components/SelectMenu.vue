<script>
import theme from "#build/ui/select-menu";
</script>

<script setup>
import { ref, computed, onMounted, toRef, toRaw } from "vue";
import { ComboboxRoot, ComboboxArrow, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxPortal, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxLabel, ComboboxSeparator, ComboboxItem, ComboboxItemIndicator, FocusScope, useForwardPropsEmits, useFilter } from "reka-ui";
import { defu } from "defu";
import { reactivePick, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useButtonGroup } from "../composables/useButtonGroup";
import { useComponentIcons } from "../composables/useComponentIcons";
import { useFormField } from "../composables/useFormField";
import { useLocale } from "../composables/useLocale";
import { usePortal } from "../composables/usePortal";
import { compare, get, getDisplayValue, isArrayOfArray } from "../utils";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
import UChip from "./Chip.vue";
import UInput from "./Input.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  id: { type: String, required: false },
  placeholder: { type: String, required: false },
  searchInput: { type: [Boolean, Object], required: false, default: true },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  required: { type: Boolean, required: false },
  trailingIcon: { type: String, required: false },
  selectedIcon: { type: String, required: false },
  content: { type: Object, required: false },
  arrow: { type: [Boolean, Object], required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  valueKey: { type: null, required: false },
  labelKey: { type: null, required: false, default: "label" },
  items: { type: null, required: false },
  defaultValue: { type: null, required: false },
  modelValue: { type: null, required: false },
  multiple: { type: Boolean, required: false },
  highlight: { type: Boolean, required: false },
  createItem: { type: [Boolean, String, Object], required: false },
  filterFields: { type: Array, required: false },
  ignoreFilter: { type: Boolean, required: false },
  autofocus: { type: Boolean, required: false },
  autofocusDelay: { type: Number, required: false, default: 0 },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  open: { type: Boolean, required: false },
  defaultOpen: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  name: { type: String, required: false },
  resetSearchTermOnBlur: { type: Boolean, required: false, default: true },
  resetSearchTermOnSelect: { type: Boolean, required: false, default: true },
  highlightOnHover: { type: Boolean, required: false },
  icon: { type: String, required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: String, required: false },
  trailing: { type: Boolean, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: String, required: false }
});
const emits = defineEmits(["update:open", "change", "blur", "focus", "create", "highlight", "update:modelValue"]);
const slots = defineSlots();
const searchTerm = defineModel("searchTerm", { type: String, ...{ default: "" } });
const { t } = useLocale();
const appConfig = useAppConfig();
const { contains } = useFilter({ sensitivity: "base" });
const rootProps = useForwardPropsEmits(reactivePick(props, "modelValue", "defaultValue", "open", "defaultOpen", "required", "multiple", "resetSearchTermOnBlur", "resetSearchTermOnSelect", "highlightOnHover"), emits);
const portalProps = usePortal(toRef(() => props.portal));
const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8, position: "popper" }));
const arrowProps = toRef(() => props.arrow);
const searchInputProps = toRef(() => defu(props.searchInput, { placeholder: t("selectMenu.search"), variant: "none" }));
const { emitFormBlur, emitFormFocus, emitFormInput, emitFormChange, size: formGroupSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(props);
const { orientation, size: buttonGroupSize } = useButtonGroup(props);
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })));
const selectSize = computed(() => buttonGroupSize.value || formGroupSize.value);
const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.selectMenu || {} })({
  color: color.value,
  variant: props.variant,
  size: selectSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value
}));
function displayValue(value) {
  if (props.multiple && Array.isArray(value)) {
    const displayedValues = value.map((item) => getDisplayValue(items.value, item, {
      labelKey: props.labelKey,
      valueKey: props.valueKey
    })).filter((v) => v != null && v !== "");
    return displayedValues.length > 0 ? displayedValues.join(", ") : void 0;
  }
  return getDisplayValue(items.value, value, {
    labelKey: props.labelKey,
    valueKey: props.valueKey
  });
}
const groups = computed(
  () => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []
);
const items = computed(() => groups.value.flatMap((group) => group));
const filteredGroups = computed(() => {
  if (props.ignoreFilter || !searchTerm.value) {
    return groups.value;
  }
  const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey];
  return groups.value.map((items2) => items2.filter((item) => {
    if (item === void 0 || item === null) {
      return false;
    }
    if (typeof item !== "object") {
      return contains(String(item), searchTerm.value);
    }
    if (item.type && ["label", "separator"].includes(item.type)) {
      return true;
    }
    return fields.some((field) => {
      const value = get(item, field);
      return value !== void 0 && value !== null && contains(String(value), searchTerm.value);
    });
  })).filter((group) => group.filter(
    (item) => !isSelectItem(item) || (!item.type || !["label", "separator"].includes(item.type))
  ).length > 0);
});
const filteredItems = computed(() => filteredGroups.value.flatMap((group) => group));
const createItem = computed(() => {
  if (!props.createItem || !searchTerm.value) {
    return false;
  }
  const newItem = props.valueKey ? { [props.valueKey]: searchTerm.value } : searchTerm.value;
  if (typeof props.createItem === "object" && props.createItem.when === "always" || props.createItem === "always") {
    return !filteredItems.value.find((item) => compare(item, newItem, props.valueKey));
  }
  return !filteredItems.value.length;
});
const createItemPosition = computed(() => typeof props.createItem === "object" ? props.createItem.position : "bottom");
const triggerRef = ref(null);
function autoFocus() {
  if (props.autofocus) {
    triggerRef.value?.$el?.focus({
      focusVisible: true
    });
  }
}
onMounted(() => {
  setTimeout(() => {
    autoFocus();
  }, props.autofocusDelay);
});
function onUpdate(value) {
  if (toRaw(props.modelValue) === value) {
    return;
  }
  const event = new Event("change", { target: { value } });
  emits("change", event);
  emitFormChange();
  emitFormInput();
  if (props.resetSearchTermOnSelect) {
    searchTerm.value = "";
  }
}
function onUpdateOpen(value) {
  let timeoutId;
  if (!value) {
    const event = new FocusEvent("blur");
    emits("blur", event);
    emitFormBlur();
    if (props.resetSearchTermOnBlur) {
      const STATE_ANIMATION_DELAY_MS = 100;
      timeoutId = setTimeout(() => {
        searchTerm.value = "";
      }, STATE_ANIMATION_DELAY_MS);
    }
  } else {
    const event = new FocusEvent("focus");
    emits("focus", event);
    emitFormFocus();
    clearTimeout(timeoutId);
  }
}
function onSelect(e, item) {
  if (!isSelectItem(item)) {
    return;
  }
  if (item.disabled) {
    e.preventDefault();
    return;
  }
  item.onSelect?.(e);
}
function isSelectItem(item) {
  return typeof item === "object" && item !== null;
}
defineExpose({
  triggerRef
});
</script>

<template>
  <DefineCreateItemTemplate>
    <ComboboxGroup :class="ui.group({ class: props.ui?.group })">
      <ComboboxItem
        :class="ui.item({ class: props.ui?.item })"
        :value="searchTerm"
        @select.prevent="emits('create', searchTerm)"
      >
        <span :class="ui.itemLabel({ class: props.ui?.itemLabel })">
          <slot name="create-item-label" :item="searchTerm">
            {{ t("selectMenu.create", { label: searchTerm }) }}
          </slot>
        </span>
      </ComboboxItem>
    </ComboboxGroup>
  </DefineCreateItemTemplate>

  <ComboboxRoot
    :id="id"
    v-slot="{ modelValue, open }"
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    ignore-filter
    as-child
    :name="name"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <ComboboxAnchor as-child>
      <ComboboxTrigger ref="triggerRef" :class="ui.base({ class: [props.ui?.base, props.class] })" tabindex="0">
        <span v-if="isLeading || !!avatar || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
          <slot name="leading" :model-value="modelValue" :open="open" :ui="ui">
            <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
            <UAvatar v-else-if="!!avatar" :size="props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()" v-bind="avatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
          </slot>
        </span>

        <slot :model-value="modelValue" :open="open">
          <template v-for="displayedModelValue in [displayValue(modelValue)]" :key="displayedModelValue">
            <span v-if="displayedModelValue !== void 0 && displayedModelValue !== null" :class="ui.value({ class: props.ui?.value })">
              {{ displayedModelValue }}
            </span>
            <span v-else :class="ui.placeholder({ class: props.ui?.placeholder })">
              {{ placeholder ?? "\xA0" }}
            </span>
          </template>
        </slot>

        <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
          <slot name="trailing" :model-value="modelValue" :open="open" :ui="ui">
            <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
          </slot>
        </span>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal v-bind="portalProps">
      <ComboboxContent :class="ui.content({ class: props.ui?.content })" v-bind="contentProps">
        <FocusScope trapped :class="ui.focusScope({ class: props.ui?.focusScope })">
          <slot name="content-top" />

          <ComboboxInput v-if="!!searchInput" v-model="searchTerm" :display-value="() => searchTerm" as-child>
            <UInput autofocus autocomplete="off" :size="size" v-bind="searchInputProps" :class="ui.input({ class: props.ui?.input })" />
          </ComboboxInput>

          <ComboboxEmpty :class="ui.empty({ class: props.ui?.empty })">
            <slot name="empty" :search-term="searchTerm">
              {{ searchTerm ? t("selectMenu.noMatch", { searchTerm }) : t("selectMenu.noData") }}
            </slot>
          </ComboboxEmpty>

          <div role="presentation" :class="ui.viewport({ class: props.ui?.viewport })">
            <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'top'" />

            <ComboboxGroup v-for="(group, groupIndex) in filteredGroups" :key="`group-${groupIndex}`" :class="ui.group({ class: props.ui?.group })">
              <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
                <ComboboxLabel v-if="isSelectItem(item) && item.type === 'label'" :class="ui.label({ class: [props.ui?.label, item.ui?.label, item.class] })">
                  {{ get(item, props.labelKey) }}
                </ComboboxLabel>

                <ComboboxSeparator v-else-if="isSelectItem(item) && item.type === 'separator'" :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator, item.class] })" />

                <ComboboxItem
                  v-else
                  :class="ui.item({ class: [props.ui?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] })"
                  :disabled="isSelectItem(item) && item.disabled"
                  :value="props.valueKey && isSelectItem(item) ? get(item, props.valueKey) : item"
                  @select="onSelect($event, item)"
                >
                  <slot name="item" :item="item" :index="index">
                    <slot name="item-leading" :item="item" :index="index">
                      <UIcon v-if="isSelectItem(item) && item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })" />
                      <UAvatar v-else-if="isSelectItem(item) && item.avatar" :size="item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()" v-bind="item.avatar" :class="ui.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })" />
                      <UChip
                        v-else-if="isSelectItem(item) && item.chip"
                        :size="props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()"
                        inset
                        standalone
                        v-bind="item.chip"
                        :class="ui.itemLeadingChip({ class: [props.ui?.itemLeadingChip, item.ui?.itemLeadingChip] })"
                      />
                    </slot>

                    <span :class="ui.itemLabel({ class: [props.ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })">
                      <slot name="item-label" :item="item" :index="index">
                        {{ isSelectItem(item) ? get(item, props.labelKey) : item }}
                      </slot>
                    </span>

                    <span :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })">
                      <slot name="item-trailing" :item="item" :index="index" />

                      <ComboboxItemIndicator as-child>
                        <UIcon :name="selectedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })" />
                      </ComboboxItemIndicator>
                    </span>
                  </slot>
                </ComboboxItem>
              </template>
            </ComboboxGroup>

            <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'bottom'" />
          </div>

          <slot name="content-bottom" />
        </FocusScope>

        <ComboboxArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow({ class: props.ui?.arrow })" />
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
