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
				<template v-if="curriculumItem.quizMode === QuizModes.practice">
					<div
						v-if="!quizPracticeStarted"
						class="w-full bg-primaryPurple flex-grow flex flex-col items-center justify-center gap-3 rounded-custom">
						<SofaHeaderText color="text-white"> Practice questions </SofaHeaderText>
						<SofaNormalText color="text-white"> Comfortable learning for topic mastery </SofaNormalText>
						<SofaNormalText color="text-white">{{ curriculumItem.quiz.questions.length }} Questions </SofaNormalText>
						<SofaButton
							bgColor="bg-white"
							textColor="text-primaryPurple"
							padding="py-3 px-9"
							customClass="font-bold"
							@click="startQuizPractice">
							Start
						</SofaButton>
					</div>
					<QuizPractice
						v-else
						:quizId="curriculumItem.quiz.id"
						class="flex-grow bg-lightGray"
						:classInst="classInst"
						:lesson="lesson" />
				</template>
				<template v-if="curriculumItem.quizMode === QuizModes.test">
					<div
						v-if="!quizTestStarted"
						class="w-full bg-primaryPurple flex-grow flex flex-col items-center justify-center gap-3 rounded-custom">
						<SofaHeaderText color="text-white"> Test yourself </SofaHeaderText>
						<SofaNormalText color="text-white"> Evaluate your level of knowledge </SofaNormalText>
						<SofaNormalText color="text-white">{{ curriculumItem.quiz.questions.length }} Questions </SofaNormalText>
						<SofaButton
							bgColor="bg-white"
							textColor="text-primaryPurple"
							padding="py-3 px-9"
							customClass="font-bold"
							@click="startQuizTest(curriculumItem.quiz.id)">
							Start
						</SofaButton>
					</div>
					<QuizTest
						v-else-if="test"
						:testId="test.id"
						:quizId="curriculumItem.quiz.id"
						:classInst="classInst"
						:lesson="lesson"
						class="flex-grow bg-lightGray" />
				</template>
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
import { useCreateTest } from '@app/composables/plays/tests'
import { ClassEntity, ClassLesson, ClassLessonable, ExtendedCurriculum } from '@modules/organizations'
import { TestEntity } from '@modules/plays'
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

const canNext = computed(() => activeItemIndex.value < props.curriculum[props.sectionIndex].items.length - 1)
const canPrev = computed(() => activeItemIndex.value > 0)
const next = () => {
	if (canNext.value) activeItemIndex.value++
}
const prev = () => {
	if (canPrev.value) activeItemIndex.value--
}

const quizPracticeStarted = ref(false)
const startQuizPractice = async () => {
	quizPracticeStarted.value = true
}

const quizTestStarted = ref(false)
const test = ref<TestEntity | null>(null)
const { createPlay: createTest } = useCreateTest(
	{
		organizationId: props.classInst.organizationId,
		classId: props.classInst.id,
		lessonId: props.lesson.id,
	},
	{ start: true, nav: false },
)
const startQuizTest = async (id: string) => {
	const t = await createTest({ quizId: id })
	if (!t) return
	test.value = t
	quizTestStarted.value = true
}

watch(
	curriculumItem,
	async () => {
		quizPracticeStarted.value = false
		quizTestStarted.value = false
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
