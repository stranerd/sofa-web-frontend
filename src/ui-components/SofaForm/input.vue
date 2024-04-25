<template>
	<div
		v-bind="$attrs"
		class="w-full gap-2 flex items-center justify-between text-[12px] mdlg:text-[14px] rounded-lg border border-darkLightGray group-focus-within:!border-primaryBlue"
		:class="{
			'!border-red-500': error,
			[`${padding}`]: true,
		}">
		<slot name="prefix" />
		<input
			v-model="content"
			:placeholder="placeholder"
			:disabled="disabled"
			:min="min"
			:max="max"
			:type="showPassword ? 'text' : type"
			class="grow bg-transparent text-darkBody placeholder:text-grayColor w-full focus:outline-none" />
		<slot name="suffix" />
		<SofaIcon
			v-if="type === 'password'"
			:name="showPassword ? 'show' : 'hide'"
			:class="showPassword ? 'h-[14px]' : 'h-[12px]'"
			@click.stop="showPassword = !showPassword" />
		<SofaIcon v-if="error" name="error-state" class="h-[15px]" />
	</div>
	<SofaText v-if="error" class="text-primaryRed" :content="error" />
</template>

<script lang="ts" setup generic="T">
import { ref } from 'vue'
import SofaIcon from '../SofaIcon'

withDefaults(
	defineProps<{
		padding?: string
		placeholder?: string
		type?: string
		min?: string | number
		max?: string | number
		disabled?: boolean
		error?: string
	}>(),
	{
		padding: 'p-3 md:p-4',
		placeholder: undefined,
		type: 'text',
		min: undefined,
		max: undefined,
		disabled: false,
		error: undefined,
	},
)

const content = defineModel<T>()
const showPassword = ref(false)
</script>
