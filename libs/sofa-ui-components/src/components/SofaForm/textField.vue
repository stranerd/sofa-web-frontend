<template>
  <div class="flex w-full flex-col relative">
    <sofa-normal-text v-if="hasTitle" customClass="!pb-2 !font-bold">
      <slot name="title" />
    </sofa-normal-text>
    <div :class="`w-full flex flex-row items-center ${disabled ? 'opacity-50' : ''
      }`" :tabindex="tabIndex" @focus="isFocused = true" @blur="isFocused = false">
      <slot name="outer-prefix" />
      <div :class="`flew-grow w-full gap-1 flex-row flex items-center justify-between lg:text-sm mdlg:text-[12px] text-xs  ${borderColor}   ${padding} ${customClass}  bg-transparent rounded-[8px] ${isFocused ? '!border-primaryBlue ' : ''
        } ${validationStatus == false ? '!border-red-500 !border' : ''}`">
        <span>
          <slot name="inner-prefix" />
        </span>
        <input v-model="content" :placeholder="placeholder" @focus="isFocused = true" @blur="
          isFocused = false
        checkValidation();
        " @keypress="isNumber" :disabled="disabled" :type="fieldType" @keyup="detectKey"
          :class="` text-bodyDark flex-grow bg-transparent text-darkBody placeholder-grayColor focus input w-full focus:outline-none lg:text-sm mdlg:text-[12px] text-xs `" />
        <slot name="inner-suffix" />
        <span class="flex flex-row gap-2 items-center">
          <sofa-icon :name="`${fieldType == 'password' ? 'show' : 'hide'}`" :customClass="`${fieldType == 'password'
            ? 'md:!h-[18px] h-[14px]'
            : 'md:!h-[13px] h-[10px]'
            }`" v-if="type == 'password'" @click.stop="
    fieldType == 'password'
      ? (fieldType = 'text')
      : (fieldType = 'password')
    " />
          <sofa-icon v-if="!validationStatus" :name="'error-state'" :customClass="'md:!h-[18px] h-[15px]'" />
        </span>
      </div>
      <slot name="outer-suffix" />
    </div>
    <div v-if="!validationStatus" class="w-full flex flex-row pt-1 justify-start">
      <sofa-normal-text :customClass="' text-left !font-normal '" :color="`text-primaryRed`">
        {{ Logic.Common.capitalizeFirstLetter(errorMessage) }}
      </sofa-normal-text>
    </div>
  </div>
</template>
<script lang="ts">
import { FormRule, Logic } from "sofa-logic"
import { defineComponent, onMounted, ref, toRef, watch } from "vue"
import SofaIcon from "../SofaIcon"
import SofaNormalText from "../SofaTypography/normalText.vue"

export default defineComponent({
  components: {
    SofaNormalText,
    SofaIcon,
  },
  props: {
    padding: {
      type: String,
      default: "py-3 px-3",
    },
    placeholder: {
      type: String,
      default: "",
    },
    customClass: {
      type: String,
      default: "",
    },
    hasTitle: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Object as () => FormRule[],
      required: false,
    },
    modelValue: {
      default: "",
    },
    defaultValue: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    name: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    updateValue: {
      type: String,
      default: "",
    },
    isFormatted: {
      type: Boolean,
      default: false,
    },
    borderColor: {
      type: String,
      default: "border-darkLightGray",
    },
  },
  name: "SofaTextField",
  emits: ["update:modelValue", "onEnter"],
  setup (props: any, context: any) {
    const content = ref("")

    const fieldType = ref("text")

    watch(content, () => {
      context.emit("update:modelValue", content.value)
      setTimeout(() => {
        checkValidation()
      }, 500)
    })

    const defaultValueRef = toRef(props, "defaultValue")

    watch(defaultValueRef, () => {
      content.value = props.defaultValue
    })

    onMounted(() => {
      if (props.modelValue) {
        content.value = props.modelValue
      }

      if (props.defaultValue) {
        content.value = props.defaultValue
      }

      if (props.type) {
        fieldType.value = props.type
      }
      if (props.isFormatted) {
        content.value = Logic.Common.convertToMoney(
          content.value ? content.value.toString().replace(/,/g, "") : 0,
          false,
          "",
          false
        )
      }
    })
    const validationStatus = ref(true)
    const errorMessage = ref("")

    const isRequired = () => {
      if (content.value) {
        validationStatus.value = true
      } else {
        validationStatus.value = false
        errorMessage.value = `${props.name} is required`
      }
    }

    const isGreaterThan = (count: number) => {
      if (content.value.length > count) {
        validationStatus.value = true
      } else {
        validationStatus.value = false
        errorMessage.value = `${props.name} must be more than ${count} characters`
      }
    }

    const isLessThan = (count: number) => {
      if (content.value.length < count) {
        validationStatus.value = true
      } else {
        validationStatus.value = false
        errorMessage.value = `${props.name} must be less than ${count} characters`
      }
    }

    const isEqualsTo = (count: number) => {
      if (content.value.length == count) {
        validationStatus.value = true
      } else {
        validationStatus.value = false
        errorMessage.value = `${props.name} must be ${count} characters`
      }
    }

    const isCondition = (condition: any, errMsg: string) => {
      if (condition) {
        validationStatus.value = true
      } else {
        validationStatus.value = false
        errorMessage.value = errMsg
      }
    }

    const isGreaterThanOrEqualsTo = (count: number) => {
      if (content.value.length >= count) {
        validationStatus.value = true
      } else {
        validationStatus.value = false
        errorMessage.value = `${props.name} must be more than ${count - 1
          } characters`
      }
    }

    const isLessThanOrEqualsTo = (count: number) => {
      if (content.value.length <= count) {
        validationStatus.value = true
      } else {
        validationStatus.value = false
        errorMessage.value = `${props.name} must be less than ${count + 1
          } characters`
      }
    }

    const isRegex = (regex: any, errMsg: string) => {
      if (content.value.match(regex)) {
        validationStatus.value = true
      } else {
        validationStatus.value = false
        errorMessage.value = errMsg
      }
    }

    const checkValidation = () => {
      if (props.rules) {
        for (let index = 0; index < props.rules.length; index++) {
          const rule = props.rules[index]
          if (rule.type == "isRequired") {
            isRequired()
          }

          if (rule.type == "isGreaterThan") {
            isGreaterThan(rule.value)
          }

          if (rule.type == "isLessThan") {
            isLessThan(rule.value)
          }

          if (rule.type == "isEqualsTo") {
            isEqualsTo(rule.value)
          }

          if (rule.type == "isGreaterThanOrEqualsTo") {
            isGreaterThanOrEqualsTo(rule.value)
          }

          if (rule.type == "isLessThanOrEqualsTo") {
            isLessThanOrEqualsTo(rule.value)
          }

          if (rule.type == "isRegex") {
            isRegex(rule.value, rule.errorMessage)
          }

          if (rule.type == "isCondition") {
            isCondition(rule.value, rule.errorMessage)
          }
        }
      }
    }

    watch(content, () => {
      checkValidation()
      if (props.isFormatted) {
        content.value = Logic.Common.convertToMoney(
          content.value ? content.value.toString().replace(/,/g, "") : 0,
          false,
          "",
          false
        )
      }
    })

    watch(props, () => {
      if (props.updateValue) {
        if (props.updateValue == "empty") {
          content.value = ""
        } else {
          content.value = props.updateValue
        }
      }
    })

    const isNumber = (evt: any) => {
      if (props.type != "tel") return true

      evt = evt ? evt : window.event
      var charCode = evt.which ? evt.which : evt.keyCode
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault()
      } else {
        return true
      }
    }

    const showError = (message: string) => {
      validationStatus.value = false
      errorMessage.value = message
    }

    const isFocused = ref(false)

    const tabIndex = Math.random()

    const emptyValue = () => {
      content.value = ""
    }

    const detectKey = (e: any) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        context.emit("onEnter", content.value)
      }
    }

    return {
      content,
      checkValidation,
      isNumber,
      errorMessage,
      validationStatus,
      showError,
      isFocused,
      tabIndex,
      fieldType,
      Logic,
      emptyValue,
      detectKey,
    }
  },
})
</script>
