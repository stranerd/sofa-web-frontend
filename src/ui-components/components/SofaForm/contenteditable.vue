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
<script lang="ts">
import { defineComponent, onMounted, ref, toRef, watch } from 'vue'

export default defineComponent({
	name: 'SofaCustomInput',
	components: {},
	props: {
		modelValue: {
			type: String,
			required: false,
			default: '',
		},
		customClass: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: '',
		},
		updateValue: {
			type: String,
			default: '',
		},
		autoFocus: {
			type: Boolean,
			default: false,
		},
		trim: {
			type: Boolean,
			default: true,
		},
	},
	emits: ['update:modelValue', 'onBlur', 'onContentChange', 'onEnter'],
	setup(props, context) {
		const textContent = ref(props.modelValue ?? '')

		const modelValueRef = toRef(props, 'modelValue')

		const tabIndex = Math.random()

		watch(textContent, () => {
			context.emit('update:modelValue', textContent.value)
			context.emit('onContentChange', textContent.value)
		})

		watch(
			modelValueRef,
			() => {
				textContent.value = modelValueRef.value
			},
			{ immediate: true },
		)

		const onInput = (e: any) => {
			textContent.value = props.trim ? e.target.innerText.trim() : e.target.innerText
		}

		const onBlur = () => {
			context.emit('onBlur', true)
		}

		const onEnter = () => {
			context.emit('onEnter', true)
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

		return {
			textContent,
			tabIndex,
			onInput,
			onBlur,
			onEnter,
		}
	},
})
</script>
<style scoped>
.customInput[contenteditable]:empty::before {
	content: attr(placeholder);
	color: #78828c;
}
</style>
