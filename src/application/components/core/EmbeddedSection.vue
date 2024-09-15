<template>
	<div class="w-full flex flex-col">
		<FileRenderer
			v-if="item.type === Coursable.file"
			:key="item.id"
			:file="item.file"
			:access="access"
			class="rounded-custom w-full bg-lightGray" />
		<template v-if="item.type === Coursable.quiz">
			<div
				v-if="!quizPlayStarted"
				class="w-full bg-primaryPurple text-white p-12 grow flex flex-col items-center justify-center gap-3 rounded-custom">
				<SofaHeading size="title">
					{{ item.quizMode === PlayTypes.practice ? 'Practice questions' : 'Test yourself' }}
				</SofaHeading>
				<SofaText>
					{{
						item.quizMode === PlayTypes.practice ? 'Comfortable learning for topic mastery' : 'Evaluate your level of knowledge'
					}}
				</SofaText>
				<SofaText>{{ item.quiz.questions.length }} Questions </SofaText>
				<SofaButton
					bgColor="bg-white"
					textColor="text-primaryPurple"
					padding="py-3 px-9"
					class="font-bold"
					@click="startQuizPlay(item.quiz, item.quizMode)">
					Start
				</SofaButton>
			</div>
			<PlayRun v-else-if="play" :playId="play.id" :isInModal="true" class="grow bg-lightGray" :type="item.quizMode" />
		</template>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useCreatePlay } from '@app/composables/plays/plays'
import { ClassEntity, ClassLesson } from '@modules/organizations'
import { PlayEntity, PlayTypes } from '@modules/plays'
import { Coursable, CourseEntity, ExtendedCourseSectionItem, QuizEntity } from '@modules/study'

const props = defineProps<
	| {
			item: ExtendedCourseSectionItem
			classInst: ClassEntity
			lesson: ClassLesson
			course?: undefined
	  }
	| {
			item: ExtendedCourseSectionItem
			course: CourseEntity
			classInst?: undefined
			lesson?: undefined
	  }
>()

const access = computed(() => {
	if (props.classInst && props.lesson)
		return { organizationId: props.classInst.organizationId, classId: props.classInst.id, lessonId: props.lesson.id }
	if (props.course) return { courseId: props.course.id }
	return {}
})

const quizPlayStarted = ref(false)
const play = ref<PlayEntity | null>(null)
const { factory, createPlay } = useCreatePlay(access, { start: true, nav: true })
const startQuizPlay = async (quiz: QuizEntity, type: PlayTypes) => {
	factory.loadFrom(type, quiz)
	const p = await createPlay()
	if (!p) return
	play.value = p
	quizPlayStarted.value = true
}

watch(
	() => props.item,
	async () => {
		quizPlayStarted.value = false
	},
	{ immediate: true },
)
</script>
