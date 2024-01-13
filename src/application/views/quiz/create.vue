<template>
	<div />
</template>

<script lang="ts">
import { useCreateQuiz } from '@/composables/study/quizzes'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'QuizCreate',
	routeConfig: {
		goBackRoute: '/library',
		middlewares: [
			async () => {
				const { createQuiz } = useCreateQuiz()
				const quiz = await createQuiz()
				if (quiz) return `/quiz/${quiz.id}/edit`
				return '/library'
			},
		],
	},
})
</script>
