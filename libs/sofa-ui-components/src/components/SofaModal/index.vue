<template>
  <component :is="Teleport" to="body">
    <transition name="fade" appear>
      <div
        :class="`fixed top-0 w-[100dvw] h-[dwh] bg-black text-white !bg-opacity-40 flex flex-col overflow-y-hidden items-center mdlg:!justify-center justify-end ${customClass}`"
        style="z-index: 1000" id="innerModal">
        <div class="h-full w-full absolute top-0 left-0" @click="closeModal" />
        <div
          class="w-full flex flex-col mdlg:h-auto h-full md:justify-center justify-end relative items-center mdlg:max-h-[85%] overflow-y-auto overflow-x-hidden">
          <slot />
        </div>
      </div>
    </transition>
  </component>
</template>
<script lang="ts">
import { Teleport as teleport_, TeleportProps, VNodeProps } from "vue"

const Teleport = teleport_ as {
  new(): {
    $props: VNodeProps & TeleportProps
  }
}

export default {
  props: {
    canClose: {
      type: Boolean,
      default: true,
    },
    close: {
      type: Function,
      required: false,
    },
    customClass: {
      type: String,
      default: "",
    },
  },
  name: "RoofModal",
  setup (props: any) {
    const closeModal = () => {
      if (props.canClose) {
        props.close?.()
      }
    }

    return {
      closeModal,
      Teleport,
    }
  },
}
</script>
