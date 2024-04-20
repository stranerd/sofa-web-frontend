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
import { ref, withDefaults } from 'vue'
import { Media, UploadedFile } from '@modules/core'

const props = withDefaults(
	defineProps<{
		multiple?: boolean
		accept?: string
	}>(),
	{
		multiple: false,
		accept: '*',
	},
)

const modelValue = defineModel<Media | Media[] | null>({ default: null })

const fileInput = ref(null as HTMLInputElement | null)
const openFileSelect = async () => {
	if (fileInput.value) fileInput.value.value = null as any
	fileInput.value?.click()
}
const handler = async (e: Event) => {
	const fileList = (e.target as HTMLInputElement)?.files ?? []
	const files: UploadedFile[] = []
	for (let i = 0; i < fileList.length; i++) files.push(new UploadedFile({ file: fileList[i] }))
	if (files.length) modelValue.value = props.multiple ? files : files[0]
	else modelValue.value = null
}
</script>
