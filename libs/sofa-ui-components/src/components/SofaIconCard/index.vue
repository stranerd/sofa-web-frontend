<template>
  <div
    :class="`w-[280px] mdlg:!w-full ${customClass} cursor-pointer  mdlg:!px-4 mdlg:!py-4 px-3 py-3 flex flex-row justify-between items-center mdlg:!bg-ligthGray bg-white shadow-custom mdlg:!shadow-none gap-3 rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px]`">
    <div :class="`flex flex-row items-center gap-ex-grow  ${data.isDone ? 'opacity-50' : ''
      } `">
      <div>
        <sofa-icon :custom-class="data.iconSize" :name="data.icon" />
      </div>
      <div class="w-full flex flex-col">
        <div class="flex flex-row items-center gap-
          <slot name=" title" />
        <sofa-icon :customClass="'h-[12px]'" :name="'right-arrow'" v-if="showArrow" />
      </div>
      <sofa-normal-text :customClass="'text-left w-full !line-clamp-1'">
        {{ data.subTitle }}
      </sofa-normal-text>
    </div>
  </div>

  <div class="w-[45px] text-right">
    <sofa-icon :customClass="'h-[22px] inline-block'" :name="'selected'" v-if="data.isDone" />
  </div>
</div></template>
<script lang="ts">
import { defineComponent } from "vue"
import SofaIcon from "../SofaIcon"
import { SofaNormalText } from "../SofaTypography"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
  },
  props: {
    customClass: {
      type: String,
      default: " ",
    },
    data: {
      type: Object as () => {
        title: string
        subTitle: string
        icon: string
        iconSize: string
        isDone: any
      },
    },
    showArrow: {
      type: Boolean,
      default: true,
    },
  },
  name: "SofaIconCard",
})
</script>
