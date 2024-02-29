<template>
	<div class="p-4 h-full flex flex-col gap-6">
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
		<div v-if="curriculumItem" class="w-full flex flex-col flex-grow">
			<ScheduleView
				v-if="curriculumItem.type === ClassLessonable.schedule"
				:classInst="classInst"
				:schedule="curriculumItem.schedule"
				class="flex-grow" />
			<div
				v-if="curriculumItem.type === ClassLessonable.file && mediaUrl"
				class="w-full rounded-custom flex-grow flex items-center justify-center bg-lightGray">
				<SofaDocumentReader v-if="curriculumItem.fileType === FileType.document" :documentUrl="mediaUrl" class="rounded-custom" />
				<SofaImageLoader
					v-if="curriculumItem.fileType === FileType.image"
					:photoUrl="mediaUrl"
					class="rounded-custom w-full h-full" />
				<SofaVideoPlayer
					v-if="curriculumItem.fileType === FileType.video"
					:videoUrl="mediaUrl"
					:type="curriculumItem.file.media.type"
					class="rounded-custom" />
			</div>
			<template v-if="curriculumItem.type === ClassLessonable.quiz">
				<div
					v-if="!quizPlayStarted"
					class="w-full bg-primaryPurple flex-grow flex flex-col items-center justify-center gap-3 rounded-custom">
					<SofaHeaderText color="text-white">
						{{ curriculumItem.quizMode === PlayTypes.practice ? 'Practice questions' : 'Test yourself' }}
					</SofaHeaderText>
					<SofaNormalText color="text-white">
						{{
							curriculumItem.quizMode === PlayTypes.practice
								? 'Comfortable learning for topic mastery'
								: 'Evaluate your level of knowledge'
						}}
					</SofaNormalText>
					<SofaNormalText color="text-white">{{ curriculumItem.quiz.questions.length }} Questions </SofaNormalText>
					<SofaButton
						bgColor="bg-white"
						textColor="text-primaryPurple"
						padding="py-3 px-9"
						customClass="font-bold"
						@click="startQuizPlay">
						Start
					</SofaButton>
				</div>
				<PlayRun
					v-else-if="play"
					:playId="play.id"
					:isInModal="true"
					class="flex-grow bg-lightGray"
					:type="curriculumItem.quizMode"
					:access="{ organizationId: classInst.organizationId, classId: classInst.id, lessonId: lesson.id }" />
			</template>
		</div>
		<div v-if="curriculumSection" class="flex flex-col gap-2">
			<SofaHeaderText>{{ itemTitle }}</SofaHeaderText>
			<SofaNormalText>{{ lesson.title }}/{{ curriculumSection.label }}</SofaNormalText>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useCreatePlay } from '@app/composables/plays/plays'
import { ClassEntity, ClassLesson, ClassLessonable, ExtendedCurriculum } from '@modules/organizations'
import { PlayEntity, PlayTypes } from '@modules/plays'
import { FileType } from '@modules/study'
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
		if (curriculumItem.value.quizMode === PlayTypes.practice) return 'Practice'
		if (curriculumItem.value.quizMode === PlayTypes.tests) return 'Test'
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

const canNext = computed(() => activeItemIndex.value < props.curriculum[props.sectionIndex].items.length - 1)
const canPrev = computed(() => activeItemIndex.value > 0)
const next = () => {
	if (canNext.value) activeItemIndex.value++
}
const prev = () => {
	if (canPrev.value) activeItemIndex.value--
}

const quizPlayStarted = ref(false)
const play = ref<PlayEntity | null>(null)
const { factory, createPlay } = useCreatePlay(
	{
		organizationId: props.classInst.organizationId,
		classId: props.classInst.id,
		lessonId: props.lesson.id,
	},
	{ start: true, nav: false },
)
const startQuizPlay = async (id: string, type: PlayTypes) => {
	factory.quizId = id
	factory.type = type
	const p = await createPlay()
	if (!p) return
	play.value = p
	quizPlayStarted.value = true
}

watch(
	curriculumItem,
	async () => {
		quizPlayStarted.value = false
		if (curriculumItem.value?.type === ClassLessonable.file)
			mediaUrl.value = await curriculumItem.value.file.getUrl({
				organizationId: props.classInst.organizationId,
				classId: props.classInst.id,
				lessonId: props.lesson.id,
			})
	},
	{ immediate: true },
)
</script>
