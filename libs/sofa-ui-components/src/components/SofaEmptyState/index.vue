<template>
  <div
    :class="`w-full flex flex-col gap-3 justify-center items-center py-9 px-6 rounded-custom bg-primaryPurple ${customClass}`">
    <sofa-icon :customClass="icon ? icon.size : 'h-[28px]'" :name="icon ? icon.name : 'attention-white'" />
    <div class="w-full flex flex-col gap-2 justify-center items-center py-2">
      <sofa-header-text :color="'text-white'" :content="title" :customClass="`!font-semibold ${titleStyle}`" />
      <sofa-normal-text :color="'text-white'" :content="subTitle"
        :custom-class="'w-full flex !font-lighter flex-row items-center text-center justify-center '" />
    </div>
    <sofa-button v-if="action" :custom-class="'!whitespace-nowrap'" :bgColor="'bg-white'" padding="py-1 px-4"
      @click="action ? action() : null" :textColor="'text-deepGray !font-semibold'">{{ actionLabel }}
    </sofa-button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import SofaButton from "../SofaButton"
import SofaIcon from "../SofaIcon"
import { SofaHeaderText, SofaNormalText } from "../SofaTypography"

export default defineComponent({
  components: {
    SofaIcon,
    SofaButton,
    SofaNormalText,
    SofaHeaderText,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    titleStyle: {
      type: String,
      default: "",
    },
    subTitle: {
      type: String,
      default: "",
    },
    action: {
      type: Function,
    },
    actionLabel: {
      type: String,
      default: "",
    },
    icon: {
      type: Object as () => {
        name: string
        size: string
      },
    },
  },
  name: "SofaEmptyState",
})
</script>
