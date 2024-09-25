<template>
	<div class="w-full h-full flex flex-col gap-4 p-4 mdlg:p-6">
		<SofaHeading v-if="$screen.desktop" size="title">Update Quiz</SofaHeading>

		<div class="w-full flex justify-between items-center sticky top-0 left-0 mdlg:hidden">
			<SofaHeading>Update Quiz</SofaHeading>
			<SofaIcon class="h-[20px]" name="circle-close" @click="close" />
		</div>

		<QuizForm
			v-if="quiz"
			:quiz="quiz"
			:factory="factory"
			:cancel="close"
			:submit="updateQuiz"
			:publish="!quiz.isPublished ? publishQuiz : undefined" />
	</div>
</template>

<script lang="ts" setup>
import { useEditQuiz } from '@app/composables/study/quizzes'
import { QuizEntity } from '@modules/study'

const props = defineProps<{
	close: () => void
	quiz: QuizEntity
}>()

const { quiz, quizFactory: factory, updateQuiz, publishQuiz } = useEditQuiz(props.quiz.id)
</script>
