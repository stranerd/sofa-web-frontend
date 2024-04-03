<template>
	<div ref="selectRef" class="flex flex-col w-full relative group" :tabIndex="-1">
		<SofaNormalText v-if="hasTitle" customClass="">
			<slot name="title" />
		</SofaNormalText>
		<div class="flex items-center gap-1 justify-between w-full rounded-md px-3 py-4" :class="customClass" @click="showOptions = true">
			<input
				v-if="!isMultiple"
				:value="selectedOptions.at(0)?.value"
				:placeholder="placeholder"
				class="grow bg-transparent placeholder:text-grayColor text-darkBody w-full focus:outline-none lg:text-sm mdlg:text-[12px] text-xs" />
			<div v-else class="w-full flex whitespace-nowrap overflow-x-auto scrollbar-hide gap-2 text-darkBody">
				<template v-if="Array.isArray(value) && value.length">
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
		<dialog
			v-if="showOptions"
			open
			class="group-focus-within:flex hidden fixed w-full flex-col z-[1000] max-h-[500px] bg-white overflow-y-auto rounded-md p-3 shadow-md"
			:style="selectRef ? `width: ${selectRef.offsetWidth}px; margin-top: ${selectRef.offsetHeight}px` : ''">
			<div v-if="autoComplete" class="w-full py-2 gap-3 flex items-center justify-between">
				<SofaTextField v-model="searchValue" placeholder="Search" customClass="w-full !bg-lightGray !placeholder:text-grayColor" />
				<SofaIcon class="h-[16px] pr-2" name="circle-close" @click="showOptions = false" />
			</div>
			<a
				v-for="item in filteredOptions"
				:key="item.key?.toString()"
				class="p-3 gap-3 w-full flex items-center hover:bg-gray-100"
				@click="selectValue(item)">
				<SofaIcon :name="itemIsSelected(item.key) ? 'checkbox-active' : 'checkbox'" class="h-[16px]" />
				<SofaNormalText :content="item.value" />
			</a>
		</dialog>
	</div>
</template>

<script lang="ts" setup generic="T">
import { computed, onMounted, ref } from 'vue'
import SofaBadge from '../SofaBadge'
import SofaIcon from '../SofaIcon/index.vue'
import SofaNormalText from '../SofaTypography/normalText.vue'
import SofaTextField from './textField.vue'
import { SelectOption } from 'sofa-logic'

const props = withDefaults(
	defineProps<{
		placeholder?: string
		options?: SelectOption<T>[]
		customClass?: string
		isMultiple?: boolean
		hasTitle?: boolean
		autoComplete?: boolean
		canUseCustom?: boolean
		selectFirstOnMount?: boolean
		error?: string
	}>(),
	{
		placeholder: '',
		options: () => [],
		customClass: '',
		isMultiple: false,
		hasTitle: false,
		autoComplete: true,
		canUseCustom: false,
		selectFirstOnMount: false,
		error: '',
	},
)

const selectRef = ref<HTMLElement>()
const showOptions = ref(false)
const searchValue = ref('')

const filteredOptions = computed(() => {
	const search = searchValue.value.toLowerCase()
	const options = props.options.filter(
		(opt) => opt.key?.toString().toLowerCase().includes(search) || opt.value?.toLowerCase().includes(search),
	)
	if (props.canUseCustom && search) options.unshift({ key: search as T, value: search })
	return options
})

const selectedOptions = computed(() => {
	const options = props.options.filter((o) => (props.isMultiple ? (value.value as T[])?.includes(o.key) : value.value === o.key))
	if (props.canUseCustom && options.length === 0) options.unshift({ key: value.value as T, value: value.value as string })
	return options
})

const model = defineModel<T | T[]>()

const value = computed({
	get: () => {
		if (props.isMultiple) return Array.isArray(model.value) ? model.value : []
		return model.value
	},
	set: (v) => (model.value = v),
})

const itemIsSelected = (key: T) => {
	if (!props.isMultiple) return key === model.value
	return Array.isArray(value.value) && value.value.some((v) => v === key)
}

const selectValue = (option: SelectOption) => {
	showOptions.value = false
	const v = option.key
	if (!props.isMultiple) return (value.value = v)
	const isSelected = itemIsSelected(v)
	if (isSelected) return (value.value = Array.isArray(value.value) ? value.value.filter((o) => o !== v) : [])
	else return (value.value = [...((value.value as T[]) ?? []), v])
}

onMounted(() => {
	if (props.selectFirstOnMount && !model.value && props.options.length) selectValue(props.options[0])
})
</script>
