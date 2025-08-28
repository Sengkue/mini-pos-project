<script>

</script>

<script setup>
import { useForwardProps } from "reka-ui";
import { reactivePick } from "@vueuse/core";
const props = defineProps({
  name: { type: String, required: true },
  mode: { type: String, required: false },
  size: { type: [String, Number], required: false },
  customize: { type: Function, required: false }
});
const iconProps = useForwardProps(reactivePick(props, "name", "mode", "size", "customize"));
</script>

<template>
  <Icon v-bind="iconProps" />
</template>
