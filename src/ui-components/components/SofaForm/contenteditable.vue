<template>
	<span
		:id="`content-${tabIndex}`"
		:class="`${customClass} !bg-white !text-left customInput focus:outline-none w-auto !text-bodyBlack placeholder:text-grayColor py-2 px-2`"
		:placeholder="placeholder"
		:contenteditable="true"
		@input="onInput"
		@blur="onBlur"
		@keydown.enter.prevent="onEnter">
		{{ textContent }}
	</span>
</template>
<script lang="ts" setup>
import { onMounted, watch } from 'vue'

const props = withDefaults(
	defineProps<{
		modelValue: string
		customClass: string
		placeholder: string
		updateValue: string
		autoFocus: boolean
		trim: boolean
	}>(),
	{
		modelValue: '',
		customClass: '',
		placeholder: '',
		updateValue: '',
		autoFocus: false,
		trim: true,
	},
)

const emit = defineEmits<{
	onContentChange: [string]
	onBlur: [boolean]
	onEnter: [boolean]
}>()

const textContent = defineModel<string>({ default: '' })

const tabIndex = Math.random()

watch(textContent, () => {
	emit('onContentChange', textContent.value)
})

const onInput = (e: any) => {
	textContent.value = props.trim ? e.target.innerText.trim() : e.target.innerText
}

const onBlur = () => {
	emit('onBlur', true)
}

const onEnter = () => {
	emit('onEnter', true)
}

const setCaretToEnd = (target: any) => {
	const range = document.createRange()
	const sel = window.getSelection()
	range.selectNodeContents(target)
	range.collapse(false)
	sel?.removeAllRanges()
	sel?.addRange(range)
	target.focus()
	range.detach() // optimization

	// set scroll to the end if multiline
	target.scrollTop = target.scrollHeight
}

onMounted(() => {
	if (props.updateValue) {
		textContent.value = props.updateValue

		setTimeout(() => {
			const contentField = document.getElementById(`content-${tabIndex}`)

			if (contentField) {
				contentField.innerText = textContent.value
			}
		}, 400)
	}

	if (props.autoFocus) {
		const contentField = document.getElementById(`content-${tabIndex}`)

		setTimeout(() => {
			setCaretToEnd(contentField)
		}, 500)
	}
})
</script>
<style scoped>
.customInput[contenteditable]:empty::before {
	content: attr(placeholder);
	color: #78828c;
}
</style>
