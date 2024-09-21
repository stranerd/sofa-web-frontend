<template>
	<div
		:data-error="error"
		class="w-full gap-2 p-3 mdlg:p-4 flex items-center font-size-sub rounded-lg bg-lightGray border border-darkLightGray group-focus-within:!border-primaryBlue has-error">
		<slot name="prefix" />
		<input
			v-model="content"
			:placeholder="placeholder"
			:disabled="disabled"
			:min="min"
			:max="max"
			:type="showPassword ? 'text' : type"
			class="grow text-darkBody placeholder:text-grayColor w-full focus:outline-none" />
		<slot name="suffix" />
		<SofaIcon
			v-if="type === 'password'"
			:name="showPassword ? 'show' : 'hide'"
			:class="showPassword ? 'h-[14px]' : 'h-[12px]'"
			@click.stop="showPassword = !showPassword" />
		<SofaIcon v-if="error" name="error-state" class="h-[15px]" />
	</div>
</template>

<script lang="ts" setup generic="T">
import { ref } from 'vue'

withDefaults(
	defineProps<{
		placeholder?: string
		type?: string
		min?: string | number
		max?: string | number
		disabled?: boolean
		error?: string
	}>(),
	{
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
