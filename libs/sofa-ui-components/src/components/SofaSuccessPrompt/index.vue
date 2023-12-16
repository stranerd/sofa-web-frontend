<template>
  <SofaModal :close="() => close?.()">
    <div class="flex flex-col gap-2 relative mdlg:p-6 p-4 py-6 items-center justify-center">
      <SofaIcon name="success-modal-icon" class="h-[39px]" />

      <SofaHeaderText v-if="title" class="text-xl" :content="title" />

      <SofaNormalText v-if="subTitle" :content="subTitle" />

      <SofaButton v-if="!button.hide" :textColor="button.textColor ?? 'text-white'"
        :bgColor="button.bgColor ?? 'bg-primaryBlue'" padding="px-4 py-2" @click="button.action?.()"
        customClass="border-transparent border-2  md:!w-auto w-full">
        {{ button.label }}
      </SofaButton>
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
  button: {
    type: Object as PropType<{
      label: string
      hide?: boolean
      bgColor?: string
      textColor?: string
      action: Function
    }>,
  },
})
</script>
