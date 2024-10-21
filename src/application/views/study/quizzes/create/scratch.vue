<template>
	<QuizCreateLayout title="Create quiz">
		<QuizForm :factory="factory" :submit="createQuiz" :cancel="() => $utils.goBack()" />
	</QuizCreateLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCreateQuiz } from '@app/composables/study/quizzes'

export default defineComponent({
	name: 'StudyQuizzesCreateScratchPage',
	routeConfig: {
		goBackRoute: '/study/quizzes/create',
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const { factory, createQuiz } = useCreateQuiz()
		return { factory, createQuiz }
	},
})
</script>
