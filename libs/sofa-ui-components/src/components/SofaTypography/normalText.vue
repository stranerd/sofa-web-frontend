<template>
  <span
    :class="` flex flex-row items-center
  ${customClass} ${color}
  ${size == 'base' ? 'lg:text-sm mdlg:text-[12px] text-xs' : ''}
  ${size == 'small' ? ' text-xs' : ''}`"
    v-if="!isHtml"
  >
    <slot />
  </span>
  <span
    v-else
    :class="` flex flex-row items-center whitespace-pre-wrap
  ${customClass} ${color}
  ${size == 'base' ? 'lg:text-sm mdlg:text-[12px] text-xs' : ''}
  ${size == 'small' ? ' text-xs' : ''}`"
    v-html="content"
  >
  </span>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    size: {
      type: String,
      default: "base",
    },
    color: {
      type: String,
      default: "text-bodyBlack",
    },
    customClass: {
      type: String,
      default: "",
    },
    isHtml: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: "",
    },
  },
  name: "RoofNormalText",
});
</script>
