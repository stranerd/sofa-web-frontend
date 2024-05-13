<template>
	<div class="flex items-center justify-around gap-1">
		<input
			v-for="index in numberOfInput"
			:id="id + index"
			:key="index"
			v-model="otps[index - 1]"
			type="number"
			class="md:w-[53px] w-[40px] aspect-square text-lg text-center text-darkBody focus:outline-none bg-lightGray rounded-custom"
			:disabled="disabled"
			@keypress="onKeyPress"
			@keyup.right="focusInputByRef(id + (index + 1))"
			@keyup.left="focusInputByRef(id + (index - 1))"
			@keyup.delete="focusInputByRef(id + (index - 1))"
			@paste="onPaste"
			@input="onInput($event, id + (index + 1))" />
	</div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'

const props = withDefaults(
	defineProps<{
		disabled?: boolean
		error?: string
		numberOfInput?: number
	}>(),
	{
		disabled: false,
		error: undefined,
		numberOfInput: 6,
	},
)

const id = $utils.getRandomValue()
const otp = defineModel<string>({ default: '' })

const otps = reactive<string[]>(otp.value.split('').slice(0, props.numberOfInput))

watch(otps, (value) => {
	if (value.length === props.numberOfInput) otp.value = value.join('')
})

const onKeyPress = (event: any) => {
	if (event.target.value.length === 1) return event.preventDefault()
}

const focusInputByRef = (id: any) => {
	document.getElementById(id)?.focus()
}

const onInput = (event: any, id: string) => {
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
	focusInputByRef(`${id}${otps.length}`)

	event.preventDefault()
}
</script>
