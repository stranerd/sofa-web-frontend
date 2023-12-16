<template>
  <SofaModal :close="() => close?.()">
    <div class="flex flex-col gap-2 relative mdlg:p-6 p-4 py-6 items-center justify-center">
      <SofaHeaderText v-if="title" class="text-xl" :content="title" />

      <SofaNormalText v-if="subTitle" :content="subTitle" />

      <div class="w-full md:flex justify-between items-center grid grid-cols-2 gap-3 mt-3">
        <div class="md:w-auto col-span-1 flex flex-col" v-for="(button, index) in buttons" :key="index">
          <SofaButton v-if="!button.hide" :textColor="button.textColor ?? (!button.isClose ? 'text-white' : 'text-grayColor')"
            :bgColor="button.bgColor ?? (!button.isClose ? 'bg-primaryRed' : 'bg-white')" padding="px-4 py-2"
            @click="button.action?.()"
            :customClass="`${button.isClose ? 'border-gray-100 md:!min-w-[100px]' : 'border-transparent'} border-2  md:!w-auto w-full`">
            {{ button.label }}
          </SofaButton>
        </div>
      </div>
    </div>
  </SofaModal>
</template>

<script lang="ts" setup>
import { defineProps, PropType } from "vue"
import SofaButton from "../SofaButton"
import SofaIcon from "../SofaIcon"
import { SofaModal2 as SofaModal } from "../SofaModal"
import { SofaHeaderText, SofaNormalText } from "../SofaTypography"

defineProps({
  close: {
    type: Function,
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
    type: Array as PropType<{
      label: string
      hide?: boolean
      bgColor?: string
      textColor?: string
      isClose?: boolean
      action: Function
    }[]>,
    required: true,
  },
})
</script>
