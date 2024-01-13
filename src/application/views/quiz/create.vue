<template>
	<div />
</template>

<script lang="ts">
import { useCreateQuiz } from '@/composables/study/quizzes'
import { generateMiddlewares } from '@/middlewares'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'QuizCreate',
	middlewares: { goBackRoute: '/library' },
	beforeRouteEnter: generateMiddlewares([
		async () => {
			const { createQuiz } = useCreateQuiz()
			const id = await createQuiz()
			if (id) return `/quiz/${id}/edit`
			return '/library'
		},
	]),
})
</script>
