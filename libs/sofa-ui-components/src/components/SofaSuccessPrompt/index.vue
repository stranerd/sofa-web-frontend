<template>
  <sofa-modal :close="() => {
    close ? close() : null
  }
    ">
    <div class="mdlg:!w-[32%] lg:!w-[30%] mdlg:!h-full w-full h-auto md:w-full flex flex-col items-center relative"
      @click.stop="() => {
        //
      }
        ">
      <div
        class="bg-white w-full flex flex-col lg:!px-6 md:!gap-5 gap-3 py-0 relative lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-0 md:!px-0 mdlg:!rounded-[16px] rounded-t-[16px] items-center justify-center">
        <div class="w-full hidden flex-col gap-3 justify-center items-center mdlg:!flex">
          <div class="w-full flex flex-row items-center justify-center">
            <sofa-icon :name="'success-modal-icon'" :customClass="'h-[39px]'" />
          </div>

          <sofa-header-text :customClass="'text-xl'" :content="title" />
          <sofa-normal-text :color="'text-[#78828C]'" :content="subTitle" />
        </div>

        <div
          class="w-full flex flex-row justify-between items-center sticky top-0 left-0 mdlg:!hidden py-2 border-[#F1F6FA] border-b px-4">
          <sofa-normal-text :customClass="'!font-bold !text-base'">
            {{ title }}
          </sofa-normal-text>
          <sofa-icon :customClass="'h-[19px]'" :name="'circle-close'" @click="close ? close() : null" />
        </div>

        <div class="w-full flex flex-row items-center justify-center mdlg:!hidden">
          <sofa-icon :name="'success-modal-icon'" :customClass="'h-[39px]'" />
        </div>

        <div class="w-full flex flex-row items-start justify-center mdlg:!hidden px-4">
          <sofa-normal-text :customClass="'text-center'">
            {{ subTitle }}
          </sofa-normal-text>
        </div>

        <div class="w-full flex flex-row justify-center items-center pb-10 md:pb-0">
          <sofa-button @click="button.action ? button.action() : null" :padding="'px-4 py-1'">
            {{ button.label }}
          </sofa-button>
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
    button: {
      type: Object as () => {
        label: string
        action: Function
      },
    },
  },
  name: "SofaSuccessPrompt",
  setup () {
    const showModal = ref(true)

    return {
      showModal,
    }
  },
})
</script>
