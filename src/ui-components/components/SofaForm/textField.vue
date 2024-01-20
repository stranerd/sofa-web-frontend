<template>
	<div class="flex w-full flex-col relative">
		<SofaNormalText v-if="hasTitle" class="!pb-2 !font-bold">
			<slot name="title" />
		</SofaNormalText>
		<div class="w-full flex items-center group" :class="{ 'opacity-50': disabled }" :tabindex="tabIndex">
			<slot name="outer-prefix" />
			<div
				class="flex-grow w-full gap-2 flex items-center justify-between lg:text-sm mdlg:text-[12px] text-xs bg-transparent rounded-lg group-focus-within:!border-primaryBlue"
				:class="{
					'!border-red-500 !border': validationStatus == false || error,
					[`${borderColor} ${padding} ${customClass}`]: true,
				}">
				<slot name="inner-prefix" />
				<input
					v-model="content"
					:placeholder="placeholder"
					:disabled="disabled"
					:type="fieldType"
					class="flex-grow bg-transparent text-darkBody placeholder:text-grayColor w-full focus:outline-none lg:text-sm mdlg:text-[12px] text-xs"
					@blur="checkValidation()"
					@keypress="isNumber"
					@keyup="detectKey" />
				<slot name="inner-suffix" />
				<SofaIcon
					v-if="type == 'password'"
					:name="fieldType == 'password' ? 'show' : 'hide'"
					:customClass="fieldType == 'password' ? 'md:!h-[18px] h-[14px]' : 'md:!h-[13px] h-[10px]'"
					@click.stop="fieldType = fieldType == 'password' ? 'text' : 'password'" />
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

<script lang="ts" setup>
import { FormRule, Logic } from 'sofa-logic'
import { ref, toRef, watch } from 'vue'
import SofaIcon from '../SofaIcon'
import SofaNormalText from '../SofaTypography/normalText.vue'

const emit = defineEmits<{
	onEnter: [string]
}>()

const props = withDefaults(
	defineProps<{
		padding?: string
		placeholder?: string
		customClass?: string
		hasTitle?: boolean
		rules?: FormRule[]
		defaultValue?: string
		type?: string
		name?: string
		disabled?: boolean
		updateValue?: string
		borderColor?: string
		error?: string
	}>(),
	{
		padding: 'p-3 md:p-4',
		placeholder: '',
		customClass: '',
		hasTitle: false,
		rules: undefined,
		defaultValue: '',
		type: 'text',
		name: '',
		disabled: false,
		updateValue: '',
		borderColor: 'border-darkLightGray',
		error: '',
	},
)

const content = defineModel<string>({ default: '' })

const fieldType = ref(props.type ?? 'text')

const defaultValueRef = toRef(props, 'defaultValue')

watch(
	defaultValueRef,
	() => {
		if (props.defaultValue) content.value = props.defaultValue
	},
	{ immediate: true },
)

const validationStatus = ref(true)
const errorMessage = ref('')

const checkValidation = () => {
	if (props.rules)
		Logic.Form.run(props.rules, {
			content: content.value,
			updateValidationStatus: (status: boolean) => (validationStatus.value = status),
			updateErrorMessage: (message: string) => (errorMessage.value = `${props.name} ${message}`),
		})
}

watch(content, () => checkValidation)

watch(
	props,
	() => {
		if (props.updateValue) {
			if (props.updateValue == 'empty') content.value = ''
			else content.value = props.updateValue
		}
	},
	{ immediate: true },
)

const isNumber = (evt: any) => {
	if (props.type != 'tel') return true

	evt = evt ?? window.event
	const charCode = evt.which ? evt.which : evt.keyCode
	if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) evt.preventDefault()
	else return true
}

const tabIndex = Math.random()

const detectKey = (e: any) => {
	if (e.key === 'Enter' || e.keyCode === 13) emit('onEnter', content.value)
}
</script>
