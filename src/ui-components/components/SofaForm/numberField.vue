<template>
	<div class="flex w-full flex-col relative">
		<SofaNormalText v-if="hasTitle" class="!pb-2 !font-bold">
			<slot name="title" />
		</SofaNormalText>
		<div class="w-full flex items-center group" :class="{ 'opacity-50': disabled }" :tabindex="tabIndex">
			<slot name="outer-prefix" />
			<div
				class="flew-grow w-full gap-2 flex items-center justify-between lg:text-sm mdlg:text-[12px] text-xs bg-transparent rounded-lg group-focus-within:!border-primaryBlue"
				:class="{
					'!border-red-500 !border': error,
					[`${borderColor} ${padding} ${customClass}`]: true,
				}">
				<slot name="inner-prefix" />
				<input
					v-model.number="content"
					:placeholder="placeholder"
					:disabled="disabled"
					type="number"
					class="flex-grow bg-transparent text-darkBody placeholder:text-grayColor w-full focus:outline-none lg:text-sm mdlg:text-[12px] text-xs" />
				<slot name="inner-suffix" />
				<SofaIcon v-if="error" name="error-state" class="md:!h-[18px] h-[15px]" />
			</div>
			<slot name="outer-suffix" />
		</div>
		<div v-if="error" class="w-full flex pt-1 justify-start">
			<SofaNormalText class="text-left !font-normal" :content="error" color="text-primaryRed" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import SofaIcon from '../SofaIcon'
import SofaNormalText from '../SofaTypography/normalText.vue'

withDefaults(
	defineProps<{
		padding?: string
		placeholder?: string
		customClass?: string
		hasTitle?: boolean
		name?: string
		disabled?: boolean
		borderColor?: string
		error?: string
	}>(),
	{
		padding: 'p-3 md:p-4',
		placeholder: '',
		customClass: '',
		hasTitle: false,
		name: '',
		disabled: false,
		borderColor: 'border-darkLightGray',
		error: '',
	},
)

const content = defineModel<number>({ default: 0 })
const tabIndex = Math.random()
</script>
