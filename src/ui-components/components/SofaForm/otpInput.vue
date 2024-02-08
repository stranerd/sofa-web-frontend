<template>
	<div class="flex flex-row items-center justify-around gap-1 z-40">
		<span v-for="index in numberOfInput" :key="index + '' + uniqueKey">
			<input
				:id="'' + uniqueKey + index"
				v-model="otps[index - 1]"
				type="tel"
				class="md:w-[53px] w-[40px] aspect-square text-lg text-center text-darkBody focus:outline-none bg-lightGray rounded-custom"
				:disabled="isDisabled"
				@keypress="onKeyPress"
				@keyup.right="focusInputByRef('' + uniqueKey + (index + 1))"
				@keyup.left="focusInputByRef('' + uniqueKey + (index - 1))"
				@keyup.delete="focusInputByRef('' + uniqueKey + (index - 1))"
				@paste="onPaste"
				@input="onInput($event, '' + uniqueKey + (index + 1))" />
		</span>
	</div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'

const props = withDefaults(
	defineProps<{
		isDisabled?: boolean
		uniqueKey?: string
		isError?: boolean
		numberOfInput?: number
		onChangeOTP?: (val: string) => void
	}>(),
	{
		isDisabled: false,
		uniqueKey: 'otpDigit',
		isError: false,
		numberOfInput: 4,
		onChangeOTP: undefined,
	},
)

const otp = defineModel<string>({ default: '' })

const otps = reactive<string[]>(otp.value.split('').slice(0, props.numberOfInput))

watch(otps, (value) => {
	if (value.length === props.numberOfInput) otp.value = value.join('')
})

const onKeyPress = (event: any) => {
	if (event.target.value.length === 1) {
		return event.preventDefault()
	}
}

const focusInputByRef = (id: any) => {
	document.getElementById(id)?.focus()
}

const onInput = (event: any, id: string) => {
	props.onChangeOTP?.(otp.value)
	if (event.inputType === 'deleteContentBackward') return false

	focusInputByRef(id)

	event.preventDefault()
}

const onPaste = (event: any) => {
	// Getting copy text
	const clipboardData = event.clipboardData || event.originalEvent.clipboardData
	const pastedData = clipboardData.getData('Text')
	otps.splice(0, otps.length, ...pastedData.split('').slice(0, props.numberOfInput))

	// focus the last input element according to length
	focusInputByRef(`${props.uniqueKey}${otps.length}`)

	event.preventDefault()
}
</script>
