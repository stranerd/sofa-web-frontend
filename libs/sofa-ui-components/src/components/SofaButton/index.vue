<template>
  <button :disabled="loading || disabled"
    class="focus:outline-none disabled:opacity-30 relative rounded-custom flex gap-2 items-center lg:text-sm mdlg:text-[12px] text-xs justify-center whitespace-nowrap"
    :class="{
      'opacity-75': loading,
      'shadow-button': hasShadow,
      [padding]: true,
      [bgColor]: true,
      [textColor]: true,
      [customClass]: true,
    }">
    <slot />
    <SofaIcon v-if="loading" name="loader" class="h-[28px] pl-2" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import SofaIcon from "../SofaIcon"

export default defineComponent({
  components: {
    SofaIcon,
  },
  props: {
    bgColor: {
      type: String,
      default: "bg-primaryBlue",
    },
    textColor: {
      type: String,
      default: "text-white",
    },
    customClass: {
      type: String,
      default: "",
    },
    padding: {
      type: String,
      default: "py-1 px-3 ",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hasShadow: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  name: "SofaButton"
})
</script>

<style scoped>
.shadow-button {
  box-shadow: 0 3px #999;
}

.shadow-button:active {
  transform: translateY(2px);
  box-shadow: none;
}
</style>