<template>
  <h3
    :class="` font-semibold text-header
	${size == 'lg' ? 'lg:text-xl mdlg:text-lg text-base' : ''}
	${size == 'xl' ? 'lg:!text-3xl mdlg:!text-xl text-base' : ''}
	${size == 'base' ? 'lg:text-base mdlg:text-[13px] text-sm' : ''}
	${size == 'xs' ? 'mdlg:!text-[12px] text-xs' : ''}
	${customClass}
	${color}`"
  >
    <slot />
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
  },
  name: "RoofHeaderText",
};
</script>
