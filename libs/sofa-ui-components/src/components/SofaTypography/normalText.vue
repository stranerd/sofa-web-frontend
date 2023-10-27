<template>
  <span :class="`flex flex-row items-center body ${customClass} ${color}
      ${size == 'base' ? 'lg:text-sm mdlg:text-[12px] text-xs' : ''}
      ${size == 'small' ? ' text-xs' : ''}`">
    <span v-if="content" v-html="content" />
    <slot v-else />
  </span>
</template>
<script lang="ts">
import { defineComponent } from "vue"
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
})
</script>

<style lang="scss" scoped>
.body {
  font-family: inherit;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;

  p {
    margin-bottom: 0.25rem;
  }

  & > p:last-child {
    margin-bottom: 0;
  }

  * {
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }
}
</style>