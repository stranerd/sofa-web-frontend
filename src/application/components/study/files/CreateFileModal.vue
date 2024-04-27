<template>
	<form class="flex flex-col gap-4 mdlg:p-6 p-4" @submit.prevent="submit">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeaderText class="!text-xl" content="Upload file" />
		</div>

		<div class="w-full flex justify-between items-center md:hidden">
			<SofaNormalText class="!font-bold" content="Upload file" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<SofaTextField
			v-model="factory.title"
			customClass="rounded-custom !bg-lightGray"
			:error="factory.errors.title"
			placeholder="File title"
			borderColor="border-transparent" />

		<SofaTextarea
			v-model="factory.description"
			padding="p-4"
			placeholder="Description..."
			textAreaStyle="!bg-lightGray rounded-custom"
			:error="factory.errors.description" />

		<SofaSelect
			v-model="factory.topic"
			customClass="rounded-custom !bg-lightGray"
			placeholder="Topic"
			borderColor="border-transparent"
			:error="factory.errors.topic"
			:options="topics.map((t) => ({ key: t.title, value: t.title }))"
			:canUseCustom="true" />

		<SofaFileInput v-model="factory.media" :accept="accept" class="w-full flex flex-col">
			<SofaButton class="w-full" padding="py-3">{{ factory.media ? 'Change file' : 'Choose file' }}</SofaButton>
		</SofaFileInput>

		<SofaButton :disabled="!factory.valid" type="submit" padding="px-5 py-3" class="w-full">Upload</SofaButton>
	</form>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useTopicsList, useGenericTagsList } from '@app/composables/interactions/tags'
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

const { topics } = useTopicsList()
const { tags } = useGenericTagsList()

watch(
	topics,
	() => {
		if (!topics.length) return
		if (factory.topicId && !factory.topic) {
			const topic = topics.find((t) => t.id === factory.topicId)
			if (topic) factory.topic = topic.title
		}
	},
	{ immediate: true },
)

watch(
	tags,
	() => {
		if (!tags.length) return
		if (factory.tagIds.length && !factory.tags.length) {
			const myTags = tags.filter((t) => factory.tagIds.includes(t.id))
			factory.tags = factory.tagIds.map((t) => myTags.find((mt) => t === mt.id)?.title).filter(Boolean)
		}
	},
	{ immediate: true },
)

if (props.file) factory.media = props.file

const submit = async () => {
	const file = await createFile()
	if (!file) return
	props.close()
	props.afterSubmit?.(file)
}
</script>
