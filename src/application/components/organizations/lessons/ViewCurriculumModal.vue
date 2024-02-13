<template>
	<div class="p-4 flex flex-col gap-6">
		<div class="flex w-full items-center gap-2 justify-between">
			<SofaHeaderText class="!font-bold !text-deepGray" :content="title" />
			<div class="flex items-center gap-4">
				<SofaIcon class="h-[16px] fill-black" name="back-arrow" :class="canPrev ? 'fill-black' : 'fill-grayColor'" @click="prev" />
				<SofaIcon
					class="h-[16px] fill-black"
					name="arrow-right-white"
					:class="canNext ? 'fill-black' : 'fill-grayColor'"
					@click="next" />
				<SofaIcon class="h-[16px]" name="circle-close" @click="close" />
			</div>
		</div>
		<div v-if="curriculumItem" class="w-full flex-grow">
			<ScheduleView
				v-if="curriculumItem.type === ClassLessonable.schedule"
				:classInst="classInst"
				:schedule="curriculumItem.schedule"
				class="h-full" />
			<div
				v-if="curriculumItem.type === ClassLessonable.file && mediaUrl"
				class="w-full rounded-custom h-full flex items-center justify-center bg-lightGray overflow-y-auto">
				<SofaDocumentReader v-if="curriculumItem.fileType === FileType.document" :documentUrl="mediaUrl" class="w-full h-full" />
				<SofaImageLoader
					v-if="curriculumItem.fileType === FileType.image"
					:photoUrl="mediaUrl"
					customClass="w-full h-full rounded-custom" />
				<SofaVideoPlayer
					v-if="curriculumItem.fileType === FileType.video"
					:videoUrl="mediaUrl"
					:type="curriculumItem.file.media.type"
					class="w-full h-full" />
			</div>
			<div
				v-if="curriculumItem.type === ClassLessonable.quiz"
				class="rounded-custom h-full flex items-center justify-center text-white"
				:class="quizStarted ? 'bg-lightGray' : 'bg-primaryPurple'">
				<div v-if="!quizStarted" class="flex flex-col items-center gap-3">
					<SofaHeaderText color="text-inherit">
						{{ curriculumItem.quizMode === QuizModes.practice ? 'Practice questions' : 'Test yourself' }}
					</SofaHeaderText>
					<SofaNormalText color="text-inherit">
						{{
							curriculumItem.quizMode === QuizModes.practice
								? 'Comfortable learning for topic mastery'
								: 'Evaluate your level of knowledge'
						}}
					</SofaNormalText>
					<SofaNormalText color="text-inherit">{{ curriculumItem.quiz.questions.length }} questions</SofaNormalText>
					<SofaButton
						bgColor="bg-white"
						textColor="text-primaryBlue"
						padding="py-3 px-9"
						customClass="font-bold"
						@click="startQuiz">
						Start
					</SofaButton>
				</div>
			</div>
		</div>
		<div v-if="curriculumSection" class="flex flex-col gap-2">
			<SofaHeaderText>{{ itemTitle }}</SofaHeaderText>
			<SofaNormalText>{{ lesson.title }}/{{ curriculumSection.label }}</SofaNormalText>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { ClassEntity, ClassLesson, ClassLessonable, ExtendedCurriculum } from '@modules/organizations'
import { FileType, QuizModes } from '@modules/study'
const props = defineProps<{
	close: () => void
	classInst: ClassEntity
	lesson: ClassLesson
	curriculum: ExtendedCurriculum
	itemIndex: number
	sectionIndex: number
}>()

const title = computed(() => {
	if (curriculumItem.value?.type === ClassLessonable.schedule) return 'Live Session'
	if (curriculumItem.value?.type === ClassLessonable.quiz) {
		if (curriculumItem.value.quizMode === QuizModes.practice) return 'Practice'
		if (curriculumItem.value.quizMode === QuizModes.test) return 'Test'
		else return curriculumItem.value.quizMode
	}
	if (curriculumItem.value?.type === ClassLessonable.file) {
		if (curriculumItem.value.fileType === FileType.document) return 'Document'
		if (curriculumItem.value.fileType === FileType.image) return 'Image'
		if (curriculumItem.value.fileType === FileType.video) return 'Video'
	}
	return 'Curriculum Item'
})
const itemTitle = computed(() => {
	if (curriculumItem.value?.type === ClassLessonable.file) return curriculumItem.value.file.title
	else if (curriculumItem.value?.type === ClassLessonable.quiz) return curriculumItem.value.quiz.title
	else return curriculumItem.value?.schedule.title
})

const mediaUrl = ref('')

const curriculumSection = computed(() => props.curriculum.at(props.sectionIndex))
const activeItemIndex = ref(props.itemIndex)

const curriculumItem = computed(() => curriculumSection.value?.items.at(activeItemIndex.value))

const quizStarted = ref(false)
const startQuiz = () => {
	quizStarted.value = true
}

const canNext = computed(() => activeItemIndex.value < props.curriculum[props.sectionIndex].items.length - 1)
const canPrev = computed(() => activeItemIndex.value > 0)
const next = () => {
	if (canNext.value) activeItemIndex.value++
}
const prev = () => {
	if (canPrev.value) activeItemIndex.value--
}

watch(
	curriculumItem,
	async () => {
		if (curriculumItem.value?.type === ClassLessonable.file) mediaUrl.value = await curriculumItem.value.file.getMediaUrl()
	},
	{ immediate: true },
)
</script>
