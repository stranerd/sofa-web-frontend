<template>
  <div class="flex w-full flex-col gap-2">
    <div v-for="(option, index) in options" :key="index" @click.stop="selectedOption = option.key"
      class="flex w-full flex-row items-center justify-between cursor-pointer py-3 border-[1px] custom-border px-3 border-gray-200">
      <div class="flex flex-row gap-2 items-center justify-between w-full">
        <div class="flex flex-row gap-ems-center justify-start">
          <span class="h-full flex items-start justify-center">
            <span :class="`h-[11px] w-[11px] rounded-full ${selectedOption == option.key ? 'bg-primaryBlue' : 'bg-[#D9D9D9]'
              }`">
            </span>
          </span>
          <sofa-normal-text>
            {{ option.value }}
          </sofa-normal-text>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { onMounted, ref, watch } from "vue"
import { SelectOption } from "../../types"
import SofaIcon from "../SofaIcon"
import SofaNormalText from "../SofaTypography/normalText.vue"

export default {
  components: {
    SofaNormalText,
    SofaIcon,
  },
  props: {
    options: {
      type: Array as () => SelectOption[],
      required: true,
    },
    modelValue: {
      required: false,
    },
  },
  name: "SofaRadio",
  emits: ["update:modelValue"],
  setup (props: any, context: any) {
    const selectedOption = ref("")

    watch(selectedOption, () => {
      context.emit("update:modelValue", selectedOption.value)
    })

    onMounted(() => {
      if (props.modelValue) {
        selectedOption.value = props.modelValue
      }
    })

    return {
      selectedOption,
    }
  },
}
</script>
