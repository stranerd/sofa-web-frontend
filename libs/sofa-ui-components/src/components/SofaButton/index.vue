<template>
  <div :class="`w-auto h-auto relative ${visible ? '' : 'invisible'} ${disabled ? 'opacity-30' : ''}`">
    <button :disabled="loading" @click="handleClicked()" :class="`focus:outline-none relative rounded-md flex flex-row gap-2 items-center z-50 ${loading ? 'opacity-75' : ''
      } lg:text-sm mdlg:text-[12px] text-xs justify-center ${padding} ${bgColor} ${textColor} ${customClass}`"
      style="border-radius: 16px 8px">
      <slot />
      <span class="pl-2" v-if="loading"><sofa-icon :name="'loader'" :custom-class="'h-[28px]'" /></span>
    </button>
    <div v-if="hasDoubleLayer && !isHovered && hasDarkLayer && !disabled"
      class="absolute top-0 left-0 w-full h-[110%] bg-black !bg-opacity-25 z-20" style="border-radius: 16px 8px"></div>
    <div v-if="hasDoubleLayer && !isHovered && !disabled" :class="`absolute top-0 left-0 w-full h-[110%] ${bgColor} z-10`"
      style="border-radius: 16px 8px"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue"
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
    hasDoubleLayer: {
      type: Boolean,
      default: true,
    },
    hasDarkLayer: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  name: "SofaButton",
  emits: ['click'],
  setup (_, ctx) {
    const isHovered = ref(false)

    const handleClicked = () => {
      ctx.emit('click')
      isHovered.value = true

      setTimeout(() => {
        isHovered.value = false
      }, 300)
    }

    return {
      isHovered,
      handleClicked,
    }
  },
})
</script>
