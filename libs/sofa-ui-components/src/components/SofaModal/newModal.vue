<template>
  <component :is="Teleport" to="body">
    <transition name="fade" appear>
      <div class="fixed top-0 w-[100dvw] h-[100dvh] z-[1000] bg-black text-white bg-opacity-40 flex flex-col items-center mdlg:justify-center justify-end">
        <div class="h-full w-full absolute top-0 left-0" @click="closeModal" />
        <div
          class="z-[1] w-full md:w-[50%] max-h-[100%] md:max-h-[80%] overflow-y-auto bg-white text-bodyBlack rounded-t-2xl md:rounded-b-2xl"
          :class="maxWidth"
        >
          <slot />
        </div>
      </div>
    </transition>
  </component>
</template>

<script lang="ts" setup>
import { Teleport } from "vue"

const props = defineProps({
  close: {
    type: Function,
    required: false,
  },
  maxWidth: {
    type: String,
    required: false,
  },
})

const closeModal = () => {
  props.close?.()
}
</script>
