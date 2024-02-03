<template>
	<div />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCreateQuiz } from '@app/composables/study/quizzes'

export default defineComponent({
	name: 'QuizCreate',
	routeConfig: {
		goBackRoute: '/library',
		middlewares: [
			async () => {
				const { createQuiz } = useCreateQuiz()
				const quiz = await createQuiz()
				if (quiz) return `/quizzes/${quiz.id}/edit`
				return '/library'
			},
		],
	},
})
</script>
