<template>
  <div :class="`flex flex-col gap-2 ${defaultSize} `">
    <sofa-normal-text v-if="hasTitle" customClass="">
      <slot name="title" />
    </sofa-normal-text>
    <div
      :class="`flex relative flex-col items-center gap-1 justify-between w-full rounded-md ${customClass} bg-grey100 ${paddings}`"
      :id="'container' + tabIndex" @focus="
        showOption = true
      isFocused = true
      ShowSelectModal = true
      hasAutoComplete = true;
      " @blur="
  isFocused = false
hideOptions();
" :tabindex="tabIndex" @click="showAutoComplete()">
      <div class="w-full flex flex-row gap-1 items-center">
        <input ref="select" :value="withKey ? valueData : textValue" :placeholder="placeholder" v-if="!isMultiple"
          disabled
          :class="` text-bodyDark flex-grow bg-transparent placeholder-grayColor text-darkBody focus input w-full focus:outline-none   lg:text-sm mdlg:text-[12px] text-xs focus:border-primaryOrange`" />
        <div v-else
          class="w-full flex flex-row whitespace-nowrap overflow-x-auto z-30 scrollbar-hide gap-2 focus text-darkBody"
          :id="`mutipleItemContainer` + tabIndex">
          <template v-if="selectedItems.length">
            <template v-for="(option, index) in selectedItems" :key="index">
              <sofa-badge :color="'blue'" v-if="getSelectedOption(option)">{{
                getSelectedOption(option)
              }}</sofa-badge>
            </template>
          </template>
          <template v-else>
            <sofa-normal-text :color="'text-grayColor'">{{
              placeholder
            }}</sofa-normal-text>
          </template>
        </div>
        <span class="pr-1 cursor-pointer z-30" @click="showOption = true">
          <sofa-icon @click.stop="
            showOption = true
          isFocused = true;
          " name="angle-small-down" custom-class=" h-[7px] cursor-pointer" />
        </span>
      </div>

      <div v-if="showOption" @click.stop="null" :class="`w-full hidden mdlg:!flex flex-col top-[101%] left-0 bg-white z-[100] max-h-[320px] ${isAbsolute ? 'min-w-[200px] absolute' : ' mt-3'
        }  overflow-y-auto rounded-md pb-3 px-3 shadow-md`">
        <div class="w-full py-2 sticky top-0 bg-white gap-3 flex flex-row items-center justify-between"
          v-if="autoComplete">
          <sofa-text-field placeholder="Search" v-model="searchValue"
            custom-class="w-full !border-none !border-b-[1px] !bg-[whitesmoke]">
          </sofa-text-field>
          <div class="pr-2 cursor-pointer" @click.stop="showOption = false">
            <sofa-icon :customClass="'h-[16px]'" :name="'circle-close'" />
          </div>
        </div>
        <div class="w-full flex flex-row py-2 bg-white" v-if="!autoComplete"></div>
        <div class="py-3 px-3 w-full flex flex-row items-center hover:!bg-gray-100 cursor-pointer"
          v-for="(item, index) in canUseCustom && searchValue ? [{ key: searchValue, value: searchValue }, ...searchResult] : searchResult"
          :key="index" @click.stop="selectValue(item)">
          <template v-if="isMultiple">
            <div class="w-full flex flex-row gap-3 items-center">
              <sofa-icon :name="itemIsSelected(item.key) ? 'checkbox-active' : 'checkbox'
                " custom-class="h-[16px]" />
              <sofa-normal-text>
                {{ item.value }}
              </sofa-normal-text>
            </div>
          </template>
          <sofa-normal-text v-else>
            {{ item.value }}
          </sofa-normal-text>
        </div>
      </div>

      <sofa-modal :canClose="true" custom-class="mdlg:!hidden" :close="() => ShowSelectModal = false"
        v-if="ShowSelectModal">
        <div @click.stop="true"
          class="rounded-t-md flex flex-col gap-4 bg-white w-full absolute overflow-y-auto h-auto max-h-[80%] bottom-0 left-0 pb-3 px-3 lg:!text-sm mdlg:!text-[12px] text-xs">
          <div class="flex items-center flex-col justify-center sticky top-0 gap-2 bg-white w-full pt-3 pb-1">
            <div class="w-full flex items-center justify-center">
              <span class="bg-gray-200 rounded-full w-[30px] h-[4px]"></span>
            </div>

            <div class="border-[1px] w-full border-gray-200 rounded bg-white" v-if="autoComplete">
              <input ref="select" :placeholder="placeholder" v-model="searchValue" autofocus
                :class="`py-3 px-3 flex-grow cursor-pointer bg-transparent placeholder-gray-600 focus input w-full filled focus:outline-none rounded-md focus:border-primary`" />
            </div>
          </div>

          <sofa-radio :options="selectOptions" v-model="selectedKey" @click.stop="true" v-if="!isMultiple" />
          <div class="w-full flex flex-col gap-2" v-else>
            <div v-for="(option, index) in selectOptions" :key="index"
              class="flex w-full flex-row items-center justify-between cursor-pointer py-3 border-[1px] custom-border px-3 border-gray-200">
              <sofa-checkbox :extraData="option" :defaultValue="itemIsSelected(option.key)"
                @click.stop="selectValue(option)">
                {{ option.value }}
              </sofa-checkbox>
            </div>
          </div>
        </div>
      </sofa-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { capitalize, defineComponent, onMounted, ref, toRef, watch } from "vue"
import { Logic } from "../../composable"
import { SelectOption } from "../../types"
import SofaBadge from "../SofaBadge"
import SofaIcon from "../SofaIcon/index.vue"
import SofaModal from "../SofaModal"
import SofaNormalText from "../SofaTypography/normalText.vue"
import SofaCheckbox from "./checkbox.vue"
import SofaRadio from "./radio.vue"
import SofaTextField from "./textField.vue"

export default defineComponent({
  name: "SofaSelect",
  components: {
    SofaIcon,
    SofaNormalText,
    SofaModal,
    SofaTextField,
    SofaRadio,
    SofaBadge,
    SofaCheckbox,
  },
  props: {
    withKey: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    options: {
      type: Array as () => SelectOption[],
      default: [],
    },
    paddings: {
      type: String,
      default: "py-4 px-3",
    },
    padding: {
      type: String,
      default: "py-4 px-3",
    },
    customClass: {
      type: String,
      default: "",
    },
    defaultOptions: {
      required: false,
      default: [],
    },
    modelValue: {
      type: String || Array,
      default: false,
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
    hasTitle: {
      type: Boolean,
      default: false,
    },
    defaultSize: {
      type: String,
      default: "w-full",
    },
    autoComplete: {
      type: Boolean,
      default: false,
    },
    labelStyle: {
      type: String,
      default: "",
    },
    isAbsolute: {
      type: Boolean,
      default: true,
    },
    updateValue: {
      type: String,
      default: "",
    },
    canUseCustom: {
      type: Boolean,
      default: false,
    }
  },
  emits: ["update:modelValue", "OnOptionSelected", "OnSearch"],
  setup (props: any, context: any) {
    const isFocused = ref(false)
    const showOption = ref(false)

    const tabIndex = Math.random()

    const ShowSelectModal = ref(false)

    const OptionRef = ref<SelectOption[]>([])

    const searchResult = ref<SelectOption[]>([])

    const selectedKey = ref()

    const valueData = ref("")

    const textValue = ref("")

    const searchValue = ref("")

    const hasAutoComplete = ref(false)

    const selectOptions = ref<any[]>([])

    const updateValueRef = toRef(props, "updateValue")

    const optionToRef = toRef(props, "options")

    const defaultOptionsRef = toRef(props, "defaultOptions")

    watch(optionToRef, () => {
      // console.log("i changed");
    })

    const showAutoComplete = () => {
      if (props.autoComplete) {
        hasAutoComplete.value = true
        showOption.value = true
      }
    }

    const hideOptions = () => {
      if (!props.autoComplete) {
        showOption.value = false
      }
    }

    const prepareSelectOptions = () => {
      selectOptions.value.length = 0
      if (Array.isArray(searchResult.value)) {
        searchResult.value.forEach((item: any) => {
          selectOptions.value.push({
            key: item.key,
            value: `${item.value}${props.withKey ? ` (${item.key})` : ""}`,
            hasIcon: item.hasIcon ? item.hasIcon : false,
            extras: item.extras ? item.extras : "",
            isImage: item.isImage ? item.isImage : false,
          })
        })
      }
    }

    watch(selectedKey, () => {
      if (selectedKey.value != 0) {
        const selectedOption = searchResult.value.filter((eachItem: any) => {
          return eachItem.key == selectedKey.value
        })
        selectValue(selectedOption[0])
        ShowSelectModal.value = false
      }
    })

    const selectedItems = ref<any[]>([])

    watch(props, () => {
      if (props.options) {
        OptionRef.value = props.options
        searchResult.value = props.options
        if (!props.isMultiple) {
          updateDefaultValue(props.modelValue)
        }
      }
      prepareSelectOptions()
    })

    watch(defaultOptionsRef, () => {
      if (props.isMultiple) {
        selectedItems.value = defaultOptionsRef.value
      }
    })

    const updateDefaultValue = (value: any) => {
      const selectedOption = searchResult.value.find((eachItem) => {
        return eachItem.key == value
      })

      selectedKey.value = value
      if (selectedOption) selectValue(selectedOption)
      else if (props.canUseCustom) selectValue({ key: value, value })
      else {
        textValue.value = ""
        valueData.value = ""
      }

      // if (props.isMultiple && value.length) {
      //   selectedItems.value = value;
      // }
    }

    onMounted(() => {
      if (props.modelValue.length > 0 && props.isMultiple) {
        selectedItems.value = props.modelValue
      }
      if (props.options) {
        OptionRef.value = props.options
        searchResult.value = props.options
      }

      if (props.autoComplete) {
        hasAutoComplete.value = props.autoComplete
      }

      if (props.modelValue || props.modelValue == "") {
        updateDefaultValue(props.modelValue)
      }

      prepareSelectOptions()
    })

    watch(updateValueRef, () => {
      updateDefaultValue(updateValueRef.value)
    })

    const emptyValue = () => {
      selectedItems.value.length = 0
      selectedKey.value = ""
      context.emit("OnOptionSelected", "")
      context.emit("update:modelValue", "")
    }

    const itemIsSelected = (inputKey: string) => {
      const item = selectedItems.value.filter((key: any) => {
        return key == inputKey
      })

      return item.length > 0
    }

    const selectValue = (option: any) => {
      if (!option) return
      if (props.autoComplete && !props.isMultiple) {
        context.emit("OnOptionSelected", option)

        isFocused.value = false
        hasAutoComplete.value = false

        if (props.withKey) {
          valueData.value = option.key
        } else {
          valueData.value = option.value
          textValue.value = option.value
        }

        context.emit("update:modelValue", option.key)

        document.getElementById("container" + tabIndex)?.blur()

        if (!props.hasConfirmation && !props.isMultiple) {
          ShowSelectModal.value = false
        }

        if (!props.isMultiple) {
          showOption.value = false
          return
        }
      }
      if (props.isMultiple) {
        if (itemIsSelected(option.key)) {
          const currentItems = JSON.parse(JSON.stringify(selectedItems.value))

          selectedItems.value = currentItems.filter((key: any) => {
            return key != option.key
          })

          document.getElementById("mutipleItemContainer" + tabIndex)?.scrollTo({
            left: 8000,
          })

          context.emit("update:modelValue", selectedItems.value)

          context.emit("OnOptionSelected", {
            selectedItems: selectedItems.value,
            extraData: props.extraData,
          })

          return
        }

        selectedItems.value.push(option.key)

        document.getElementById("mutipleItemContainer" + tabIndex)?.scrollTo({
          left: 8000,
        })

        context.emit("update:modelValue", selectedItems.value)
        context.emit("OnOptionSelected", {
          selectedItems: selectedItems.value,
          extraData: props.extraData,
        })
      } else {
        context.emit("update:modelValue", option.key)
        context.emit("OnOptionSelected", option)
        if (props.withKey) {
          valueData.value = option.key
        } else {
          valueData.value = option.value
          textValue.value = option.value
        }
        isFocused.value = false
        showOption.value = false

        document.getElementById("container" + tabIndex)?.blur()

        if (!props.hasConfirmation) {
          ShowSelectModal.value = false
        }
      }
    }

    const getSelectedOption = (keyValue: any) => {
      const option = searchResult.value.filter((eachItem: any) => {
        return eachItem.key == keyValue
      })

      if (option[0]) {
        return option[0].value
      }
    }

    const searchOption = () => {
      if (props.autoComplete) {
        searchResult.value = Logic.Common.searchArray(
          OptionRef.value,
          capitalize(searchValue.value)
        )
      }
    }

    watch(searchValue, () => {
      searchOption()
    })

    watch(OptionRef, () => {
      searchOption()
    })

    watch(searchResult, () => {
      prepareSelectOptions()
    })

    return {
      showOption,
      valueData,
      isFocused,
      selectValue,
      tabIndex,
      textValue,
      itemIsSelected,
      selectedItems,
      getSelectedOption,
      ShowSelectModal,
      selectOptions,
      selectedKey,
      searchValue,
      searchResult,
      hasAutoComplete,
      hideOptions,
      showAutoComplete,
      emptyValue,
    }
  },
})
</script>
