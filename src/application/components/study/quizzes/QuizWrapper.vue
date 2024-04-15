<template>
	<slot :questions="questions" />
</template>

<script lang="ts" setup>
import { useQuiz } from '@app/composables/study/quizzes'
import { QuizEntity } from '@modules/study'

const props = defineProps<{
	quiz: QuizEntity
}>()

const { questions } = useQuiz(props.quiz.id, { members: true })
</script>
