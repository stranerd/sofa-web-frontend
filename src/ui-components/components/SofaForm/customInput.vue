<template>
	<input
		v-model="textContent"
		:class="customClass"
		class="!bg-white focus:outline-none !text-bodyBlack placeholder:text-grayColor p-2"
		:placeholder="placeholder"
		:autofocus="autoFocus"
		@blur="emit('onBlur', true)"
		@keydown.enter.prevent="emit('onEnter', true)" />
</template>
<script lang="ts" setup>
import { onMounted, watch } from 'vue'

const props = withDefaults(
	defineProps<{
		customClass?: string
		placeholder?: string
		updateValue?: string
		autoFocus?: boolean
	}>(),
	{
		customClass: '',
		placeholder: '',
		updateValue: '',
		autoFocus: false,
	},
)

const emit = defineEmits<{
	onContentChange: [string]
	onBlur: [boolean]
	onEnter: [boolean]
}>()

const textContent = defineModel<string>({ default: '' })

watch(textContent, () => {
	emit('onContentChange', textContent.value)
})

onMounted(() => {
	if (props.updateValue) textContent.value = props.updateValue
})
</script>
