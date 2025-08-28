<script>
import theme from "#build/ui/toast";
</script>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { ToastRoot, ToastTitle, ToastDescription, ToastAction, ToastClose, useForwardPropsEmits } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
import UButton from "./Button.vue";
import UProgress from "./Progress.vue";
const props = defineProps({
  as: { type: null, required: false },
  title: { type: [String, Object, Function], required: false },
  description: { type: [String, Object, Function], required: false },
  icon: { type: String, required: false },
  avatar: { type: Object, required: false },
  color: { type: null, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  close: { type: [Boolean, Object], required: false, default: true },
  closeIcon: { type: String, required: false },
  actions: { type: Array, required: false },
  progress: { type: [Boolean, Object], required: false, default: true },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  defaultOpen: { type: Boolean, required: false },
  open: { type: Boolean, required: false },
  type: { type: String, required: false },
  duration: { type: Number, required: false }
});
const emits = defineEmits(["escapeKeyDown", "pause", "resume", "swipeStart", "swipeMove", "swipeCancel", "swipeEnd", "update:open"]);
const slots = defineSlots();
const { t } = useLocale();
const appConfig = useAppConfig();
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "defaultOpen", "open", "duration", "type"), emits);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.toast || {} })({
  color: props.color,
  orientation: props.orientation,
  title: !!props.title || !!slots.title
}));
const el = ref();
const height = ref(0);
onMounted(() => {
  if (!el.value) {
    return;
  }
  nextTick(() => {
    height.value = el.value?.$el?.getBoundingClientRect()?.height;
  });
});
defineExpose({
  height
});
</script>

<template>
  <ToastRoot
    ref="el"
    v-slot="{ remaining, duration, open }"
    v-bind="rootProps"
    :data-orientation="orientation"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="{ '--height': height }"
  >
    <slot name="leading">
      <UAvatar v-if="avatar" :size="props.ui?.avatarSize || ui.avatarSize()" v-bind="avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
      <UIcon v-else-if="icon" :name="icon" :class="ui.icon({ class: props.ui?.icon })" />
    </slot>

    <div :class="ui.wrapper({ class: props.ui?.wrapper })">
      <ToastTitle v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
        <slot name="title">
          <component :is="title()" v-if="typeof title === 'function'" />
          <component :is="title" v-else-if="typeof title === 'object'" />
          <template v-else>
            {{ title }}
          </template>
        </slot>
      </ToastTitle>
      <ToastDescription v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description">
          <component :is="description()" v-if="typeof description === 'function'" />
          <component :is="description" v-else-if="typeof description === 'object'" />
          <template v-else>
            {{ description }}
          </template>
        </slot>
      </ToastDescription>

      <div v-if="orientation === 'vertical' && (actions?.length || !!slots.actions)" :class="ui.actions({ class: props.ui?.actions })">
        <slot name="actions">
          <ToastAction v-for="(action, index) in actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
            <UButton size="xs" :color="color" v-bind="action" />
          </ToastAction>
        </slot>
      </div>
    </div>

    <div v-if="orientation === 'horizontal' && (actions?.length || !!slots.actions) || close" :class="ui.actions({ class: props.ui?.actions, orientation: 'horizontal' })">
      <template v-if="orientation === 'horizontal' && (actions?.length || !!slots.actions)">
        <slot name="actions">
          <ToastAction v-for="(action, index) in actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
            <UButton size="xs" :color="color" v-bind="action" />
          </ToastAction>
        </slot>
      </template>

      <ToastClose v-if="close || !!slots.close" as-child>
        <slot name="close" :ui="ui">
          <UButton
            v-if="close"
            :icon="closeIcon || appConfig.ui.icons.close"
            color="neutral"
            variant="link"
            :aria-label="t('toast.close')"
            v-bind="typeof close === 'object' ? close : {}"
            :class="ui.close({ class: props.ui?.close })"
            @click.stop
          />
        </slot>
      </ToastClose>
    </div>

    <UProgress
      v-if="progress && open && remaining > 0 && duration"
      :model-value="remaining / duration * 100"
      :color="color"
      v-bind="typeof progress === 'object' ? progress : {}"
      size="sm"
      :class="ui.progress({ class: props.ui?.progress })"
    />
  </ToastRoot>
</template>
