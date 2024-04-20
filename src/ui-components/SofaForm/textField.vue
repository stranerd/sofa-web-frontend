<template>
	<div class="flex w-full flex-col relative">
		<SofaNormalText v-if="hasTitle" class="!pb-2 !font-bold">
			<slot name="title" />
		</SofaNormalText>
		<div class="w-full flex items-center group" :class="{ 'opacity-50': disabled }">
			<slot name="outer-prefix" />
			<div
				class="grow w-full gap-2 flex items-center justify-between lg:text-sm mdlg:text-[12px] text-xs bg-transparent rounded-lg group-focus-within:!border-primaryBlue"
				:class="{
					'!border-red-500 !border': error,
					[`${borderColor} ${padding} ${customClass}`]: true,
				}">
				<slot name="inner-prefix" />
				<input
					v-model="content"
					:placeholder="placeholder"
					:disabled="disabled"
					:min="min"
					:max="max"
					:type="showPassword ? 'text' : type"
					class="grow bg-transparent text-darkBody placeholder:text-grayColor w-full focus:outline-none lg:text-sm mdlg:text-[12px] text-xs" />
				<slot name="inner-suffix" />
				<SofaIcon
					v-if="type === 'password'"
					:name="showPassword ? 'show' : 'hide'"
					:class="showPassword ? 'md:!h-[18px] h-[14px]' : 'md:!h-[13px] h-[10px]'"
					@click.stop="showPassword = !showPassword" />
				<SofaIcon v-if="error" name="error-state" class="md:!h-[18px] h-[15px]" />
			</div>
			<slot name="outer-suffix" />
		</div>
		<SofaNormalText v-if="error" class="text-left !font-normal pt-1 justify-start" :content="error" color="text-primaryRed" />
	</div>
</template>

<script lang="ts" setup generic="T">
import { ref } from 'vue'
import SofaIcon from '../SofaIcon'
import SofaNormalText from '../SofaTypography/normalText.vue'

withDefaults(
	defineProps<{
		padding?: string
		placeholder?: string
		customClass?: string
		hasTitle?: boolean
		type?: string
		name?: string
		min?: string | number
		max?: string | number
		disabled?: boolean
		borderColor?: string
		error?: string
	}>(),
	{
		padding: 'p-3 md:p-4',
		placeholder: '',
		customClass: '',
		hasTitle: false,
		rules: undefined,
		type: 'text',
		name: '',
		min: undefined,
		max: undefined,
		disabled: false,
		borderColor: 'border-darkLightGray',
		error: '',
	},
)

const content = defineModel<T>()
const showPassword = ref(false)
</script>
