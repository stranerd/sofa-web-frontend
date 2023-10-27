<template>
  <h3 :class="`font-semibold text-header body ${size == 'lg' ? 'lg:text-xl mdlg:text-lg text-base' : ''}
        	${size == 'xl' ? 'lg:!text-3xl mdlg:!text-xl text-base' : ''}
        	${size == 'base' ? 'lg:text-base mdlg:text-[13px] text-sm' : ''}
        	${size == 'xs' ? 'mdlg:!text-[12px] text-xs' : ''}
        	${customClass}
        	${color}`">
    <span v-if="content" v-html="content" />
    <slot v-else />
  </h3>
</template>
<script lang="ts">
export default {
  props: {
    size: {
      type: String,
      default: "lg",
    },
    color: {
      type: String,
      default: "text-darkBody",
    },
    customClass: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
  },
  name: "RoofHeaderText",
}
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