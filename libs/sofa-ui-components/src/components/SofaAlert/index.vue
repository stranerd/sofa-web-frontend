<template>
  <div class="fixed w-full flex sofa-alert p-4 items-end justify-end z-[100]">
    <div
      class="md:!min-w-[300px] md:!w-auto w-full flex items-center md:p-4 p-3 rounded-custom justify-between border-2 gap-3"
      :class="{
        'border-[#4BAF7D] bg-[#E1F5EB]': type === 'success',
        'border-[#F55F5F] bg-[#FAEBEB]': type === 'error',
        'border-[#FA9632] bg-[#FFF4EB]': type === 'warning',
        'border-[#7DC8FA] bg-[#E2F3FD]': type === 'info'
      }">
      <SofaIcon :name="`${type}-icon`" class="h-[25px]" />
      <SofaNormalText class="!font-semibold w-full text-left" :content="content" />
      <SofaIcon name="circle-close" class="h-[18px] ml-auto" @click="closeAlert()" />
    </div>
  </div>
</template>
<script lang="ts">
import { gsap } from "gsap"
import { defineComponent, onMounted } from "vue"
import SofaIcon from "../SofaIcon"
import { SofaNormalText } from "../SofaTypography"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
  },
  props: {
    type: {
      type: String as () => "success" | "warning" | "error" | "info",
      default: "success",
    },
    content: {
      type: String,
      default: "",
    },
    close: {
      type: Function,
    },
  },
  name: "SofaAlert",
  setup (props) {
    onMounted(() => {
      //
      gsap.from(".sofa-alert", {
        y: -130,
        duration: 1.5,
        ease: "expo.out",
      })

      setTimeout(() => {
        closeAlert()
      }, 4000)
    })

    const closeAlert = () => {
      if (props.close) {
        gsap.to(".sofa-alert", {
          y: -130,
          duration: 1.5,
          ease: "expo.out",
        })

        setTimeout(() => {
          props.close ? props.close() : null
        }, 1500)
      }
    }

    return {
      closeAlert,
    }
  },
})
</script>
