<template>
	<div class="flex flex-col gap-4 mdlg:p-6 p-4">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeaderText class="!text-xl" content="Add study material" />
		</div>

		<div class="w-full flex justify-between items-center md:hidden">
			<SofaNormalText class="!font-bold" content="Add study material" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>
		<div class="w-full grid grid-cols-2 mdlg:grid-cols-3 place-items-center h-full md:!gap-6 !gap-3">
			<template v-for="item in newMaterialOptions" :key="item.name">
				<a
					v-if="item.type === 'quiz'"
					class="rounded-custom w-full mdlg:w-[200px] h-[149px] bg-lightGray flex flex-col gap-3 items-center justify-center"
					@click="selectQuiz(item)">
					<SofaIcon :name="item.icon" customClass="h-[22px]!fill-black" />
					<SofaNormalText customClass="!font-bold">
						{{ item.name }}
					</SofaNormalText>
				</a>

				<SofaFileInput
					v-if="item.type === 'file'"
					:isWrapper="true"
					:accept="item.extras.accept"
					class="rounded-custom w-full mdlg:w-[200px] h-[149px] bg-lightGray flex flex-col gap-3 items-center justify-center"
					@update:modelValue="(media) => media && uploadFile(item, media as any)">
					<SofaIcon :name="item.icon" customClass="h-[22px] !fill-black" />
					<SofaNormalText customClass="!font-bold">
						{{ item.name }}
					</SofaNormalText>
				</SofaFileInput>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useModals } from '@app/composables/core/modals'
import { UploadedFile } from '@modules/core'
import { PlayTypes } from '@modules/plays'
import { FileEntity, FileType, QuizEntity } from '@modules/study'

const props = defineProps<{
	close: () => void
	onSelected: (selected: { file: FileEntity } | { quiz: QuizEntity; mode: PlayTypes }) => void
}>()

const select = (selected: { file: FileEntity } | { quiz: QuizEntity; mode: PlayTypes }) => {
	props.onSelected(selected)
	props.close()
}

const newMaterialOptions = [
	{
		name: 'Document',
		type: 'file',
		extras: { type: FileType.document, accept: 'application/pdf' },
		icon: 'document-course',
	},
	{
		name: 'Image',
		type: 'file',
		extras: { type: FileType.image, accept: 'image/*' },
		icon: 'image-course',
	},

	{
		name: 'Video',
		type: 'file',
		extras: { type: FileType.video, accept: 'video/*' },
		icon: 'video-course',
	},

	{
		name: 'Practice',
		type: 'quiz',
		extras: { mode: PlayTypes.practice },
		icon: 'open-notebook',
	},
	{
		name: 'Test',
		type: 'quiz',
		extras: { mode: PlayTypes.tests },
		icon: 'document-text',
	},
] as const

const uploadFile = (options: (typeof newMaterialOptions)[number], file: UploadedFile) => {
	if (options.type !== 'file' || !file) return
	useModals().study.createFile.open({
		file,
		accept: options.extras.accept,
		afterSubmit: (file) => select({ file }),
	})
}

const selectQuiz = (options: (typeof newMaterialOptions)[number]) => {
	if (options.type !== 'quiz') return
	useModals().study.selectQuiz.open({
		mode: options.extras.mode,
		onSelected: (quiz) => select({ quiz, mode: options.extras.mode }),
	})
}
</script>
