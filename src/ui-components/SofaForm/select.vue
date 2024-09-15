<template>
	<div
		ref="selectRef"
		:data-error="error"
		class="group relative flex items-center gap-2 w-full rounded-lg bg-lightGray px-3 py-4 has-error font-size-sub"
		:tabIndex="-1"
		@click="showOptions = true">
		<span v-if="placeholder" class="font-semibold">{{ placeholder }}</span>
		<span class="ml-auto grow truncate">{{ selectedOptions.map((o) => o.value).join(', ') }}</span>
		<SofaIcon name="angle-small-down" class="h-[7px] fill-deepGray" />
		<dialog
			v-if="showOptions"
			open
			class="group-focus-within:flex hidden absolute top-0 left-0 w-full flex-col z-[1000] max-h-[500px] bg-white overflow-y-auto rounded-md shadow-md"
			:style="selectRef ? `width: ${selectRef.offsetWidth}px; margin-top: ${selectRef.offsetHeight}px` : ''">
			<div v-if="autocomplete" class="w-full p-2 gap-3 flex items-center justify-between">
				<input
					v-model="searchValue"
					placeholder="Search"
					class="bg-transparent border border-lightGray placeholder:text-grayColor p-3 w-full" />
				<SofaIcon class="h-[16px] pr-2" name="circle-close" @click="showOptions = false" />
			</div>
			<SofaText
				v-for="item in filteredOptions"
				:key="item.key?.toString()"
				as="a"
				class="p-3 gap-3 w-full flex items-center hover:bg-gray-100"
				@click="selectValue(item)">
				<SofaIcon :name="itemIsSelected(item.key) ? 'checkbox-active' : 'checkbox'" class="h-[16px]" />
				<span>{{ item.value }}</span>
			</SofaText>
		</dialog>
	</div>
</template>

<script lang="ts" setup generic="T">
import { computed, onMounted, ref } from 'vue'

interface SelectOption {
	key: T
	value: string
}

const props = withDefaults(
	defineProps<{
		placeholder?: string
		options: SelectOption[]
		multiple?: boolean
		autocomplete?: boolean
		custom?: boolean
		selectFirstOnMount?: boolean
		error?: string
	}>(),
	{
		placeholder: '',
		multiple: false,
		autocomplete: true,
		custom: false,
		selectFirstOnMount: false,
		error: undefined,
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
	if (props.custom && search) options.unshift({ key: search as T, value: search })
	return options
})

const selectedOptions = computed(() => {
	const options = props.options.filter((o) => (props.multiple ? (value.value as T[])?.includes(o.key) : value.value === o.key))
	if (props.custom && options.length === 0) options.unshift({ key: value.value as T, value: value.value as string })
	return options
})

const model = defineModel<T | T[]>()

const value = computed({
	get: () => {
		if (props.multiple) return Array.isArray(model.value) ? model.value : []
		return model.value
	},
	set: (v) => (model.value = v),
})

const itemIsSelected = (key: T) => {
	if (!props.multiple) return key === model.value
	return Array.isArray(value.value) && value.value.some((v) => v === key)
}

const selectValue = (option: SelectOption) => {
	showOptions.value = false
	const v = option.key
	if (!props.multiple) return (value.value = v)
	const isSelected = itemIsSelected(v)
	if (isSelected) return (value.value = Array.isArray(value.value) ? value.value.filter((o) => o !== v) : [])
	else return (value.value = [...((value.value as T[]) ?? []), v])
}

onMounted(() => {
	const valueIsEmpty = !model.value || (Array.isArray(model.value) && model.value.length === 0)
	if (props.selectFirstOnMount && valueIsEmpty && props.options.length) selectValue(props.options[0])
})
</script>
