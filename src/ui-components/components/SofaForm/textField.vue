<template>
	<div class="flex w-full flex-col relative">
		<SofaNormalText v-if="hasTitle" class="!pb-2 !font-bold">
			<slot name="title" />
		</SofaNormalText>
		<div class="w-full flex items-center group" :class="{ 'opacity-50': disabled }">
			<slot name="outer-prefix" />
			<div
				class="flex-grow w-full gap-2 flex items-center justify-between lg:text-sm mdlg:text-[12px] text-xs bg-transparent rounded-lg group-focus-within:!border-primaryBlue"
				:class="{
					'!border-red-500 !border': !validationStatus || error,
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
					class="flex-grow bg-transparent text-darkBody placeholder:text-grayColor w-full focus:outline-none lg:text-sm mdlg:text-[12px] text-xs"
					@blur="checkValidation()" />
				<slot name="inner-suffix" />
				<SofaIcon
					v-if="type === 'password'"
					:name="showPassword ? 'show' : 'hide'"
					:customClass="showPassword ? 'md:!h-[18px] h-[14px]' : 'md:!h-[13px] h-[10px]'"
					@click.stop="showPassword = !showPassword" />
				<SofaIcon v-if="!validationStatus || error" name="error-state" class="md:!h-[18px] h-[15px]" />
			</div>
			<slot name="outer-suffix" />
		</div>
		<div v-if="!validationStatus" class="w-full flex pt-1 justify-start">
			<SofaNormalText class="text-left !font-normal capitalize" color="text-primaryRed" :content="errorMessage" />
		</div>
		<div v-if="error" class="w-full flex pt-1 justify-start">
			<SofaNormalText class="text-left !font-normal" :content="error" color="text-primaryRed" />
		</div>
	</div>
</template>

<script lang="ts" setup generic="T">
import { ref, watch } from 'vue'
import SofaIcon from '../SofaIcon'
import SofaNormalText from '../SofaTypography/normalText.vue'
import { FormRule, Logic } from 'sofa-logic'

const props = withDefaults(
	defineProps<{
		padding?: string
		placeholder?: string
		customClass?: string
		hasTitle?: boolean
		rules?: FormRule[]
		defaultValue?: T
		type?: string
		name?: string
		min?: string | number
		max?: string | number
		disabled?: boolean
		updateValue?: T
		borderColor?: string
		error?: string
	}>(),
	{
		padding: 'p-3 md:p-4',
		placeholder: '',
		customClass: '',
		hasTitle: false,
		rules: undefined,
		defaultValue: undefined,
		type: 'text',
		name: '',
		min: undefined,
		max: undefined,
		disabled: false,
		updateValue: undefined,
		borderColor: 'border-darkLightGray',
		error: '',
	},
)

const content = defineModel<T>()
const showPassword = ref(false)

const validationStatus = ref(true)
const errorMessage = ref('')

const checkValidation = () => {
	if (props.rules)
		Logic.Form.run(props.rules, {
			content: content.value as any,
			updateValidationStatus: (status) => (validationStatus.value = status),
			updateErrorMessage: (message) => (errorMessage.value = `${props.name} ${message}`),
		})
}

watch(content, () => checkValidation)

watch(
	props,
	() => {
		if (props.defaultValue) content.value = props.defaultValue
		if (props.updateValue) {
			if (props.updateValue == 'empty') content.value = '' as any
			else content.value = props.updateValue
		}
	},
	{ immediate: true },
)
</script>
