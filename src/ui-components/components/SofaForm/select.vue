<template>
	<div class="flex flex-col w-full relative group" :tabIndex="-1">
		<SofaNormalText v-if="hasTitle" custom-class="">
			<slot name="title" />
		</SofaNormalText>
		<div class="flex items-center gap-1 justify-between w-full rounded-md px-3 py-4" :class="customClass" @click="showOptions = true">
			<input
				v-if="!isMultiple"
				:value="selectedOptions.at(0)?.value"
				:placeholder="placeholder"
				class="flex-grow bg-transparent placeholder:text-grayColor text-darkBody w-full focus:outline-none lg:text-sm mdlg:text-[12px] text-xs" />
			<div v-else class="w-full flex whitespace-nowrap overflow-x-auto scrollbar-hide gap-2 text-darkBody">
				<template v-if="value.length">
					<template v-for="option in selectedOptions" :key="option">
						<SofaBadge color="blue">{{ option.value }}</SofaBadge>
					</template>
				</template>
				<SofaNormalText v-else color="text-grayColor" :content="placeholder" />
			</div>
			<SofaIcon name="angle-small-down" class="h-[7px] pr-1" />
		</div>
		<div v-if="error" class="w-full flex pt-1 justify-start">
			<SofaNormalText class="text-left !font-normal" :content="error" color="text-primaryRed" />
		</div>
		<div
			v-if="showOptions"
			class="group-focus-within:flex hidden w-full mdlg:w-auto mdlg:min-w-[320px] h-full mdlg:h-auto left-0 top-0 mdlg:left-[unset] mdlg:top-[unset] fixed flex-col bg-white z-10 mdlg:max-h-[320px] overflow-y-auto rounded-md p-3 shadow-md">
			<div v-if="autoComplete" class="w-full py-2 gap-3 flex items-center justify-between">
				<SofaTextField v-model="searchValue" placeholder="Search" custom-class="w-full !bg-lightGray !placeholder:text-grayColor" />
				<SofaIcon class="h-[16px] pr-2" name="circle-close" @click="showOptions = false" />
			</div>
			<a
				v-for="(item, index) in filteredOptions"
				:key="index"
				class="p-3 gap-3 w-full flex items-center hover:bg-gray-100"
				@click="selectValue(item)">
				<SofaIcon :name="itemIsSelected(item.key) ? 'checkbox-active' : 'checkbox'" class="h-[16px]" />
				<SofaNormalText :content="item.value" />
			</a>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { SelectOption } from 'sofa-logic'
import { computed, defineEmits, defineProps, ref } from 'vue'
import SofaBadge from '../SofaBadge'
import SofaIcon from '../SofaIcon/index.vue'
import SofaNormalText from '../SofaTypography/normalText.vue'
import SofaTextField from './textField.vue'

const props = defineProps({
	placeholder: {
		type: String,
		default: '',
	},
	options: {
		type: Array as () => SelectOption[],
		default: () => [],
	},
	customClass: {
		type: String,
		default: '',
	},
	modelValue: {
		type: [String, Array],
		default: '',
	},
	isMultiple: {
		type: Boolean,
		default: false,
	},
	hasTitle: {
		type: Boolean,
		default: false,
	},
	autoComplete: {
		type: Boolean,
		default: true,
	},
	canUseCustom: {
		type: Boolean,
		default: false,
	},
	error: {
		type: String,
		default: '',
	},
})

const emits = defineEmits(['update:modelValue'])

const showOptions = ref(false)
const searchValue = ref('')

const filteredOptions = computed(() => {
	const search = searchValue.value.toLowerCase()
	const options = props.options.filter((opt) => opt.key.toLowerCase().includes(search) || opt.value.toLowerCase().includes(search))
	if (props.canUseCustom && search) options.unshift({ key: search, value: search })
	return options
})

const selectedOptions = computed(() => {
	const options = props.options.filter((o) => (props.isMultiple ? value.value.includes(o.key) : value.value === o.key))
	if (props.canUseCustom && options.length === 0) options.unshift({ key: value.value, value: value.value as string })
	return options
})

const value = computed({
	get: () => {
		if (props.isMultiple) return Array.isArray(props.modelValue) ? props.modelValue : []
		return props.modelValue
	},
	set: (v) => emits('update:modelValue', v),
})

const itemIsSelected = (key: string) => {
	if (!props.isMultiple) return key === props.modelValue
	return Array.isArray(value.value) && value.value.some((v) => v === key)
}

const selectValue = (option: SelectOption) => {
	if (!option) return
	showOptions.value = false
	const v = option.key
	if (!props.isMultiple) return (value.value = v)
	const isSelected = itemIsSelected(v)
	if (isSelected) return (value.value = Array.isArray(value.value) ? value.value.filter((o) => o !== v) : [])
	else return (value.value = [...value.value, v])
}
</script>
