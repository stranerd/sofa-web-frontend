<template>
	<div class="w-full gap-2 p-2 flex items-center font-size-sub rounded-lg bg-white">
		<slot name="prefix" />
		<input
			v-model="text"
			class="grow focus:outline-none placeholder:text-grayColor p-0 cursor-text"
			:placeholder="placeholder"
			:autofocus="autoFocus"
			@blur="emit('onBlur', true)"
			@keydown.enter.prevent="emit('onEnter', true)" />
		<slot name="suffix" />
	</div>
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
