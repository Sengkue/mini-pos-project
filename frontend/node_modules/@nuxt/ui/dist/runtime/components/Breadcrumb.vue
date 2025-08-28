<script>
import theme from "#build/ui/breadcrumb";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useLocale } from "../composables/useLocale";
import { get } from "../utils";
import { tv } from "../utils/tv";
import { pickLinkProps } from "../utils/link";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
import ULinkBase from "./LinkBase.vue";
import ULink from "./Link.vue";
const props = defineProps({
  as: { type: null, required: false, default: "nav" },
  items: { type: Array, required: false },
  separatorIcon: { type: String, required: false },
  labelKey: { type: String, required: false, default: "label" },
  class: { type: null, required: false },
  ui: { type: null, required: false }
});
const slots = defineSlots();
const { dir } = useLocale();
const appConfig = useAppConfig();
const separatorIcon = computed(() => props.separatorIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.breadcrumb || {} })());
</script>

<template>
  <Primitive :as="as" aria-label="breadcrumb" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <ol :class="ui.list({ class: props.ui?.list })">
      <template v-for="(item, index) in items" :key="index">
        <li :class="ui.item({ class: [props.ui?.item, item.ui?.item] })">
          <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
            <ULinkBase v-bind="slotProps" as="span" :aria-current="active && index === items.length - 1 ? 'page' : void 0" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], active: index === items.length - 1, disabled: !!item.disabled, to: !!item.to })">
              <slot :name="item.slot || 'item'" :item="item" :index="index">
                <slot :name="item.slot ? `${item.slot}-leading` : 'item-leading'" :item="item" :active="index === items.length - 1" :index="index">
                  <UIcon v-if="item.icon" :name="item.icon" :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon], active: index === items.length - 1 })" />
                  <UAvatar v-else-if="item.avatar" :size="props.ui?.linkLeadingAvatarSize || ui.linkLeadingAvatarSize()" v-bind="item.avatar" :class="ui.linkLeadingAvatar({ class: [props.ui?.linkLeadingAvatar, item.ui?.linkLeadingAvatar], active: index === items.length - 1 })" />
                </slot>

                <span v-if="get(item, props.labelKey) || !!slots[item.slot ? `${item.slot}-label` : 'item-label']" :class="ui.linkLabel({ class: [props.ui?.linkLabel, item.ui?.linkLabel] })">
                  <slot :name="item.slot ? `${item.slot}-label` : 'item-label'" :item="item" :active="index === items.length - 1" :index="index">
                    {{ get(item, props.labelKey) }}
                  </slot>
                </span>

                <slot :name="item.slot ? `${item.slot}-trailing` : 'item-trailing'" :item="item" :active="index === items.length - 1" :index="index" />
              </slot>
            </ULinkBase>
          </ULink>
        </li>

        <li v-if="index < items.length - 1" role="presentation" aria-hidden="true" :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator] })">
          <slot name="separator">
            <UIcon :name="separatorIcon" :class="ui.separatorIcon({ class: [props.ui?.separatorIcon, item.ui?.separatorIcon] })" />
          </slot>
        </li>
      </template>
    </ol>
  </Primitive>
</template>
