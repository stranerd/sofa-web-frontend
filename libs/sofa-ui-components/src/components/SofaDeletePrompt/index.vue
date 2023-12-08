<template>
  <sofa-modal :close="() => close?.()">
    <div class="mdlg:!w-[40%] lg:!w-[35%] mdlg:!h-full w-full h-auto md:w-full flex flex-col items-center relative">
      <div
        class="bg-white text-bodyBlack w-full flex flex-col md:gap-5 gap-4 relative mdlg:p-6 p-4 mdlg:rounded-2xl rounded-t-2xl items-center justify-center">
        <div class="w-full hidden flex-col gap-3 justify-center items-center mdlg:!flex">
          <sofa-header-text :customClass="'text-xl'" :content="title" />
          <sofa-normal-text :content="subTitle" />
        </div>

        <div class="w-full flex justify-between items-center mdlg:!hidden border-[#F1F6FA] border-b pb-2">
          <sofa-normal-text :customClass="'!font-bold !text-base'">
            {{ title }}
          </sofa-normal-text>
          <sofa-icon :customClass="'h-[19px]'" :name="'circle-close'" @click="close?.()" />
        </div>

        <div class="w-full flex flex-row items-start justify-center mdlg:!hidden">
          <sofa-normal-text :customClass="'text-center'">
            {{ subTitle }}
          </sofa-normal-text>
        </div>

        <div class="w-full md:flex justify-between items-center grid grid-cols-2 gap-3">
          <div class="md:w-auto col-span-1 flex flex-col" v-for="(button, index) in buttons" :key="index">
            <sofa-button v-if="!button.hide" :textColor="button.textColor ?? (!button.isClose ? 'text-white' : 'text-grayColor')"
              :bgColor="button.bgColor ?? (!button.isClose ? 'bg-primaryRed' : 'bg-white')" :padding="'px-4 py-2'"
              @click="button.action ? button.action() : null"
              :customClass="`${button.isClose ? 'border-gray-100 md:!min-w-[100px]' : 'border-transparent'} border-2  md:!w-auto w-full`">
              {{ button.label }}
            </sofa-button>
          </div>
        </div>
      </div>
    </div>
  </sofa-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue"
import SofaButton from "../SofaButton"
import SofaIcon from "../SofaIcon"
import SofaModal from "../SofaModal"
import { SofaHeaderText, SofaNormalText } from "../SofaTypography"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaModal,
    SofaButton,
  },
  props: {
    close: {
      type: Function,
    },
    customClass: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    subTitle: {
      type: String,
      default: "",
    },
    buttons: {
      type: Object as () => {
        label: string
        hide?: boolean
        bgColor?: string
        textColor?: string
        isClose?: boolean
        action: Function
      }[],
    },
  },
  name: "SofaDeletePrompt"
})
</script>
