<template>
	<div />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCreateQuiz } from '@app/composables/study/quizzes'

export default defineComponent({
	name: 'StudyQuizzesCreate',
	routeConfig: {
		goBackRoute: '/library',
		middlewares: [
			'isAuthenticated',
			async () => {
				const { createQuiz } = useCreateQuiz()
				const quiz = await createQuiz()
				if (quiz) return `/study/quizzes/${quiz.id}/edit`
				return '/library'
			},
		],
	},
})
</script>
