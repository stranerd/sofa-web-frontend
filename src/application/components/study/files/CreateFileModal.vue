<template>
	<div></div>
</template>

<script lang="ts" setup>
import { useCreateFile } from '@app/composables/study/files'
import { UploadedFile } from '@modules/core'
import { FileEntity } from '@modules/study'

const props = withDefaults(
	defineProps<{
		close: () => void
		accept?: string
		file?: UploadedFile
		afterSubmit?: (file: FileEntity) => void
	}>(),
	{
		accept: 'image/*,video/*,application/pdf',
		file: undefined,
		afterSubmit: undefined,
	},
)

const { factory, createFile } = useCreateFile()

if (props.file) factory.media = props.file

const submit = async () => {
	const file = await createFile()
	if (!file) return
	props.close()
	props.afterSubmit?.(file)
}

submit
</script>
