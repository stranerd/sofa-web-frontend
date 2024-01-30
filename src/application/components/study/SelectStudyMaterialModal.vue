<template>
	<div class="flex flex-col gap-4 mdlg:p-6 p-4">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeaderText class="!text-xl" content="Add study material" />
		</div>

		<div class="w-full flex justify-between items-center md:hidden">
			<SofaNormalText class="!font-bold" content="Add live schedule" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>
		<div class="w-full grid grid-cols-2 mdlg:grid-cols-3 place-items-center h-full md:!gap-6 !gap-3">
			<template v-for="(item, index) in newMaterialOptions" :key="index">
				<a
					v-if="item.type == 'quiz'"
					class="rounded-custom w-full mdlg:w-[200px] h-[149px] bg-lightGray flex flex-col gap-3 items-center justify-center">
					<SofaIcon :name="item.icon" customClass="h-[22px]!fill-black"> </SofaIcon>
					<SofaNormalText customClass="!font-bold">
						{{ item.name }}
					</SofaNormalText>
				</a>

				<SofaFileAttachment
					v-if="item.type == 'image'"
					v-model="imageFile"
					:isWrapper="true"
					customClass="flex flex-col"
					accept="image/png, image/gif, image/jpeg">
					<template #content>
						<a
							class="w-full rounded-custom md:w-[200px] h-[149px] bg-lightGray flex flex-col gap-3 items-center justify-center">
							<SofaIcon :name="item.icon" customClass="h-[22px] !fill-black"> </SofaIcon>
							<SofaNormalText customClass="!font-bold">
								{{ item.name }}
							</SofaNormalText>
						</a>
					</template>
				</SofaFileAttachment>

				<SofaFileAttachment
					v-if="item.type == 'document'"
					v-model="documentFile"
					:isWrapper="true"
					customClass="flex flex-col"
					accept="application/pdf">
					<template #content>
						<a
							class="w-full rounded-custom md:w-[200px] h-[149px] bg-lightGray flex flex-col gap-3 items-center justify-center">
							<SofaIcon :name="item.icon" customClass="h-[22px] !fill-black"> </SofaIcon>
							<SofaNormalText customClass="!font-bold">
								{{ item.name }}
							</SofaNormalText>
						</a>
					</template>
				</SofaFileAttachment>

				<SofaFileAttachment
					v-if="item.type == 'video'"
					v-model="videoFile"
					:isWrapper="true"
					customClass="flex flex-col"
					accept="video/mp4">
					<template #content>
						<a
							class="w-full rounded-custom md:w-[200px] h-[149px] bg-lightGray flex flex-col gap-3 items-center justify-center">
							<SofaIcon :name="item.icon" customClass="h-[22px] !fill-black"> </SofaIcon>
							<SofaNormalText customClass="!font-bold">
								{{ item.name }}
							</SofaNormalText>
						</a>
					</template>
				</SofaFileAttachment>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { FileEntity, QuizEntity, QuizModes } from '@modules/study'

const props = defineProps<{
	close: () => void
	onSelected: (selected: { file: FileEntity } | { quiz: QuizEntity; mode: QuizModes }) => void
}>()

const select = (selected: { file: FileEntity } | { quiz: QuizEntity; mode: QuizModes }) => {
	props.onSelected(selected)
	props.close()
}

select
const newMaterialOptions: { name: string; type: string; icon: IconName }[] = [
	{
		name: 'Document',
		type: 'document',
		icon: 'document-course',
	},
	{
		name: 'Image',
		type: 'image',
		icon: 'image-course',
	},

	{
		name: 'Video',
		type: 'video',
		icon: 'video-course',
	},

	{
		name: 'Practice',
		type: 'quiz',
		icon: 'open-notebook',
	},
	{
		name: 'Test',
		type: 'quiz',
		icon: 'document-text',
	},
]

const videoFile = ref()
const imageFile = ref()
const documentFile = ref()
</script>
