<template>
	<a @click="openFileSelect">
		<input
			ref="fileInput"
			:accept="accept"
			:multiple="multiple as boolean"
			class="hidden"
			name="file"
			type="file"
			@change.prevent="handler" />
		<slot />
	</a>
</template>

<script lang="ts" setup>
import { Media, UploadedFile } from '@modules/core'
import { PropType, ref } from 'vue'

const props = defineProps({
	modelValue: {
		type: [Object, Array] as PropType<Media[] | Media>,
		required: false,
		default: () => null,
	},
	multiple: {
		type: Boolean,
		required: false,
		default: false,
	},
	accept: {
		type: String,
		required: false,
		default: '*',
	},
})

const emit = defineEmits<{ 'update:modelValue': [Media[] | Media] }>()

const fileInput = ref(null as HTMLInputElement | null)
const openFileSelect = async () => {
	if (fileInput.value) fileInput.value.value = null as any
	fileInput.value?.click()
}
const handler = async (e: Event) => {
	const fileList = (e.target as HTMLInputElement)?.files ?? []
	const files: UploadedFile[] = []
	for (let i = 0; i < fileList.length; i++) files.push(new UploadedFile({ file: fileList[i] }))
	if (files.length) emit('update:modelValue', props.multiple ? files : files[0])
}
</script>
