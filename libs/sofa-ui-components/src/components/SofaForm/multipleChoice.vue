<template>
  <div class="flex w-full flex-col gap-4 content">
    <sofa-normal-text v-if="hasTitle" customClass="!pb-2">
      <slot name="title" />
    </sofa-normal-text>
    <div class="w-full flex flex-col gap-4">
      <div class="w-full flex flex-row items-center gap-2 justify-between">
        <sofa-text-field :placeholder="'Enter new option'" :customClass="'flex flex-grow'" v-model="optionContent"
          :update-value="updateValue" type="text">
        </sofa-text-field>
        <sofa-button :padding="'px-5 py-3'" @click="addOption">Add</sofa-button>
      </div>
      <draggable :class="`w-full grid-cols-1 gap-3 grid  ${options.length == 0 ? 'bg-gray-100 h-[140px] rounded-lg' : ''
        }`" v-model="options" item-key="key" group="options">
        <template #item="{ element, index }">
          <div @click="selectedOption = element.key" :class="`col-span-1 px-3 py-3 rounded-[15px] flex flex-row gap-3 justify-between items-center bg-white border-[1px] cursor-pointer ${selectedOption == element.key
            ? 'border-[#83AF9B]'
            : 'border-[#E8E8E8]'
            } `">
            <div class="flex flex-row items-center gap-3">
              <div class="w-[25px]">
                <div :class="`h-[24px] w-[24px] rounded-[8px] flex flex-row items-center justify-center ${selectedOption == element.key
                  ? 'bg-primaryGreen text-white'
                  : 'bg-[#F7F7F7] text-[#878787]'
                  } `">
                  {{ index + 1 }}
                </div>
              </div>

              <sofa-normal-text :color="'text-[#78867B]'" :customClass="'text-left'">
                {{ element.value }}
              </sofa-normal-text>
            </div>
            <div class="w-[25px]">
              <sofa-icon :name="'close'" :custom-class="'h-[15px] cursor-pointer'" @click="removeOption(element.key)" />
            </div>
          </div>
        </template>
        <template #footer v-if="options.length == 0">
          <div class="w-full flex items-center justify-center">
            <sofa-normal-text :color="'text-gray-400'">Your options would show up here</sofa-normal-text>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue"
import draggable from "vuedraggable"
import { Logic } from "../../composable"
import SofaButton from "../SofaButton"
import SofaIcon from "../SofaIcon"
import SofaNormalText from "../SofaTypography/normalText.vue"
import SofaTextField from "./textField.vue"

export default defineComponent({
  components: {
    SofaNormalText,
    SofaTextField,
    SofaButton,
    draggable,
    SofaIcon,
  },
  props: {
    modelValue: {
      type: String,
      required: false,
    },
    hasTitle: {
      type: Boolean,
      default: false,
    },
    labelStyle: {
      type: String,
      default: "",
    },
    updateValue: {
      type: String,
      default: "",
    },
    defaultAnswer: {
      type: String,
      default: "",
    },
    extraId: {
      type: String,
      default: "",
    },
  },
  name: "SofaMultipleChoice",
  emits: ["update:modelValue", "onUpdated"],
  setup (props, context) {
    const tabIndex = Math.random()

    const optionContent = ref("")

    const updateValue = ref("")

    const options = ref<any[]>([])

    const selectedOption = ref("")

    const addOption = (e: any) => {
      e.preventDefault()

      if (!optionContent.value.trim()) return

      updateValue.value = optionContent.value
      options.value.push({
        key: Logic.Common.makeid(9),
        value: optionContent.value,
      })

      optionContent.value = ""
      updateValue.value = "empty"
      setTimeout(() => {
        updateValue.value = ""
      }, 200)

      if (options.value.length == 1) {
        selectedOption.value = options.value[0].key
      }
      context.emit("update:modelValue", {
        options: options.value,
        answer: selectedOption.value,
      })
      context.emit("onUpdated", {
        options: options.value,
        answer: selectedOption.value,
        extraId: props.extraId,
      })
    }

    const removeOption = (key: string) => {
      options.value = options.value.filter((option) => {
        return option.key != key
      })
      if (key == selectedOption.value) {
        if (options.value.length > 0) {
          selectedOption.value = options.value[0].key
        }
      }
      context.emit("update:modelValue", {
        options: options.value,
        answer: selectedOption.value,
      })
      context.emit("onUpdated", {
        options: options.value,
        answer: selectedOption.value,
        extraId: props.extraId,
      })
    }

    watch(selectedOption, () => {
      context.emit("update:modelValue", {
        options: options.value,
        answer: selectedOption.value,
      })
      context.emit("onUpdated", {
        options: options.value,
        answer: selectedOption.value,
        extraId: props.extraId,
      })
    })

    onMounted(() => {
      if (props.updateValue) {
        const optionsData = JSON.parse(props.updateValue)
        options.value = optionsData
        selectedOption.value = props.defaultAnswer
      }
    })

    return {
      tabIndex,
      optionContent,
      options,
      selectedOption,
      addOption,
      removeOption,
      updateValue,
    }
  },
})
</script>
