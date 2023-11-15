<template>
  <div class="w-full flex flex-col gap-3 fixed left-0 bottom-0 mdlg:!hidden z-[100]">
    <div v-if="tabIsActive('base')" class="w-full flex flex-row items-center justify-end pr-2 mdlg:hidden">
      <span
        class="px-3 py-2 bg-primaryPurple flex flex-row gap-2 rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px]"
        style="box-shadow: 0px 4px 8px rgba(120, 130, 140, 0.05)" @click="Logic.Common.GoToRoute('/chats/new')">
        <sofa-normal-text :color="'text-white'">
          Ask me anything
        </sofa-normal-text>
        <div :style="`background-image: url('/images/icons/robot.svg')`"
          class="w-[24px] h-[24px] flex flex-row items-center justify-center bg-cover bg-center rounded-full"></div>
      </span>
    </div>
    <div
      class="grid grid-cols-5 gap-3 lg:!hidden items-center py-3 z-50 w-full justify-center rounded-t-xl bg-backgroundGray">
      <div class="col-span-1 flex flex-col items-center justify-center" @click="Logic.Common.GoToRoute('/')">
        <sofa-icon :name="tabIsActive('base') ? 'home-mobile-active' : 'home-mobile'" :customClass="'h-[30px] pb-2 '" />
        <span v-if="tabIsActive('base')" class="w-[8px] h-[4px] bg-primaryPurple rounded-[8px]">
        </span>
      </div>

      <div class="col-span-1 flex flex-col items-center justify-center" @click="Logic.Common.GoToRoute('/chats')">
        <sofa-icon :name="tabIsActive('chats') ? 'chat-mobile-active' : 'chat-mobile'" :customClass="'h-[30px] pb-2 '" />
        <span v-if="tabIsActive('chats')" class="w-[8px] h-[4px] bg-primaryPurple rounded-[8px]">
        </span>
      </div>

      <div class="col-span-1 flex flex-col items-center justify-center" @click="showAddItem()">
        <div class="h-[52px] w-[52px] rounded-full flex flex-row justify-center items-center bg-primaryPurple">
          <sofa-icon :name="'plus-white'" :customClass="'h-[17px]'" />
        </div>
      </div>

      <div class="col-span-1 flex flex-col items-center justify-center" @click="Logic.Common.GoToRoute('/marketplace')">
        <sofa-icon :name="tabIsActive('marketplace') ? 'marketplace-active' : 'marketplace'
          " :customClass="'h-[31px] pb-2 '" />
        <span v-if="tabIsActive('explore')" class="w-[8px] h-[4px] bg-primaryPurple rounded-[8px]">
        </span>
      </div>

      <div class="col-span-1 flex flex-col items-center justify-center" @click="Logic.Common.GoToRoute('/library')">
        <sofa-icon :name="tabIsActive('library') ? 'library-mobile-active' : 'library-mobile'
          " :customClass="'h-[30px] pb-2 '" />
        <span v-if="tabIsActive('library')" class="w-[8px] h-[4px] bg-primaryPurple rounded-[8px]">
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref } from "vue"
import { Logic } from "sofa-logic"
import SofaIcon from "../SofaIcon/index.vue"
import { SofaNormalText } from "../SofaTypography"

export default {
  components: {
    SofaIcon,
    SofaNormalText,
  },
  props: {
    tabIsActive: {
      type: Function,
      required: true,
    },
    accountType: {
      type: String,
      default: "",
    },
    showAddItem: {
      type: Function,
      required: true,
    },
  },
  name: "SofaBottomBar",
  setup () {
    const tabs: any = []

    const hoverTab = ref("")

    return {
      hoverTab,
      tabs,
      Logic,
    }
  },
}
</script>
