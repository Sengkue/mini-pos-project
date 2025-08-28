<script>
import theme from "#build/ui/pagination";
</script>

<script setup>
import { computed } from "vue";
import { PaginationRoot, PaginationList, PaginationListItem, PaginationFirst, PaginationPrev, PaginationEllipsis, PaginationNext, PaginationLast, useForwardPropsEmits } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
const props = defineProps({
  as: { type: null, required: false },
  firstIcon: { type: String, required: false },
  prevIcon: { type: String, required: false },
  nextIcon: { type: String, required: false },
  lastIcon: { type: String, required: false },
  ellipsisIcon: { type: String, required: false },
  color: { type: null, required: false, default: "neutral" },
  variant: { type: null, required: false, default: "outline" },
  activeColor: { type: null, required: false, default: "primary" },
  activeVariant: { type: null, required: false, default: "solid" },
  showControls: { type: Boolean, required: false, default: true },
  size: { type: null, required: false },
  to: { type: Function, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  defaultPage: { type: Number, required: false },
  disabled: { type: Boolean, required: false },
  itemsPerPage: { type: Number, required: false, default: 10 },
  page: { type: Number, required: false },
  showEdges: { type: Boolean, required: false, default: false },
  siblingCount: { type: Number, required: false, default: 2 },
  total: { type: Number, required: false, default: 0 }
});
const emits = defineEmits(["update:page"]);
const slots = defineSlots();
const { dir } = useLocale();
const appConfig = useAppConfig();
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "defaultPage", "disabled", "itemsPerPage", "page", "showEdges", "siblingCount", "total"), emits);
const firstIcon = computed(() => props.firstIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleRight : appConfig.ui.icons.chevronDoubleLeft));
const prevIcon = computed(() => props.prevIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronRight : appConfig.ui.icons.chevronLeft));
const nextIcon = computed(() => props.nextIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight));
const lastIcon = computed(() => props.lastIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleLeft : appConfig.ui.icons.chevronDoubleRight));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pagination || {} })());
</script>

<template>
  <PaginationRoot v-slot="{ page, pageCount }" v-bind="rootProps" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <PaginationList v-slot="{ items }" :class="ui.list({ class: props.ui?.list })">
      <PaginationFirst v-if="showControls || !!slots.first" as-child :class="ui.first({ class: props.ui?.first })">
        <slot name="first">
          <UButton :color="color" :variant="variant" :size="size" :icon="firstIcon" :to="to?.(1)" />
        </slot>
      </PaginationFirst>
      <PaginationPrev v-if="showControls || !!slots.prev" as-child :class="ui.prev({ class: props.ui?.prev })">
        <slot name="prev">
          <UButton :color="color" :variant="variant" :size="size" :icon="prevIcon" :to="page > 1 ? to?.(page - 1) : void 0" />
        </slot>
      </PaginationPrev>

      <template v-for="(item, index) in items">
        <PaginationListItem v-if="item.type === 'page'" :key="index" as-child :value="item.value" :class="ui.item({ class: props.ui?.item })">
          <slot name="item" v-bind="{ item, index, page, pageCount }">
            <UButton
              :color="page === item.value ? activeColor : color"
              :variant="page === item.value ? activeVariant : variant"
              :size="size"
              :label="String(item.value)"
              :ui="{ label: ui.label() }"
              :to="to?.(item.value)"
              square
            />
          </slot>
        </PaginationListItem>

        <PaginationEllipsis v-else :key="item.type" :index="index" as-child :class="ui.ellipsis({ class: props.ui?.ellipsis })">
          <slot name="ellipsis">
            <UButton :color="color" :variant="variant" :size="size" :icon="ellipsisIcon || appConfig.ui.icons.ellipsis" />
          </slot>
        </PaginationEllipsis>
      </template>

      <PaginationNext v-if="showControls || !!slots.next" as-child :class="ui.next({ class: props.ui?.next })">
        <slot name="next">
          <UButton :color="color" :variant="variant" :size="size" :icon="nextIcon" :to="page < pageCount ? to?.(page + 1) : void 0" />
        </slot>
      </PaginationNext>
      <PaginationLast v-if="showControls || !!slots.last" as-child :class="ui.last({ class: props.ui?.last })">
        <slot name="last">
          <UButton :color="color" :variant="variant" :size="size" :icon="lastIcon" :to="to?.(pageCount)" />
        </slot>
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>
