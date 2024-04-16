<template>
	<input
		v-model="text"
		class="bg-white focus:outline-none text-bodyBlack placeholder:text-grayColor p-2 cursor-text lg:text-sm mdlg:text-[12px] text-xs"
		:placeholder="placeholder"
		:autofocus="autoFocus"
		@blur="emit('onBlur', true)"
		@keydown.enter.prevent="emit('onEnter', true)" />
</template>
<script lang="ts" setup>
withDefaults(
	defineProps<{
		placeholder?: string
		autoFocus?: boolean
	}>(),
	{
		placeholder: '',
		autoFocus: false,
	},
)

const emit = defineEmits<{
	onBlur: [boolean]
	onEnter: [boolean]
}>()

const text = defineModel<string>({ default: '' })
</script>
