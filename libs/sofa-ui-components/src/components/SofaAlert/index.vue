<template>
  <div
    class="fixed w-full flex sofa-alert flex-row px-4 py-4 items-end justify-end z-[999999999999999]"
  >
    <div
      :class="`md:!min-w-[300px] mdlg:!min-w-[300px] md:!w-auto mdlg:!w-auto w-full flex flex-row items-center md:py-4 md:px-4 px-3 py-3 custom-border justify-between border-[2px] ${
        type == 'success' ? 'border-[#4BAF7D] bg-[#E1F5EB]' : ''
      }
      ${type == 'error' ? 'border-[#F55F5F] bg-[#FAEBEB]' : ''}
      ${type == 'warning' ? 'border-[#FA9632] bg-[#FFF4EB]' : ''} 
      ${type == 'info' ? 'border-[#7DC8FA] bg-[#E2F3FD]' : ''} `"
    >
      <div class="flex flex-row items-center space-x-3">
        <sofa-icon :name="`${type}-icon`" :customClass="'h-[25px]'" />
        <sofa-normal-text :customClass="'!font-semibold w-full text-left'">
          {{ content }}
        </sofa-normal-text>
      </div>

      <div class="w-[30px] flex flex-row justify-end">
        <sofa-icon
          :name="'circle-close'"
          :customClass="'h-[18px]'"
          @click="closeAlert()"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue";
import SofaIcon from "../SofaIcon";
import { SofaNormalText } from "../SofaTypography";
import { gsap } from "gsap";

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
  setup(props) {
    onMounted(() => {
      //
      gsap.from(".sofa-alert", {
        y: -130,
        duration: 1.5,
        ease: "expo.out",
      });

      setTimeout(() => {
        closeAlert();
      }, 4000);
    });

    const closeAlert = () => {
      if (props.close) {
        gsap.to(".sofa-alert", {
          y: -130,
          duration: 1.5,
          ease: "expo.out",
        });

        setTimeout(() => {
          props.close ? props.close() : null;
        }, 1500);
      }
    };

    return {
      closeAlert,
    };
  },
});
</script>
