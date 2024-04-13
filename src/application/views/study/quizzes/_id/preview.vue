<template>
	<ExpandedLayout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<Quiz
			v-if="quiz"
			:title="quiz.title"
			:questions="questions"
			:rightButtonConfig="
				(extras) => ({
					label: 'Next',
					bgColor: 'bg-primaryBlue',
					textColor: 'text-white',
					disabled: !extras.canNext,
					click: extras.next,
				})
			"
			:leftButtonConfig="
				(extras) => ({
					label: 'Prev',
					bgColor: 'bg-white border border-gray-100',
					textColor: 'text-grayColor',
					disabled: !extras.canPrev,
					click: extras.previous,
				})
			" />
	</ExpandedLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import { useQuiz } from '@app/composables/study/quizzes'
import Quiz from '@app/components/study/quizzes/Quiz.vue'

export default defineComponent({
	name: 'QuizIdPreviewPage',
	components: { Quiz },
	routeConfig: {
		goBackRoute: (route) => `/study/quizzes/${route.params.id}/edit`,
		middlewares: ['isAuthenticated'],
	},
	setup() {
		useMeta({
			title: 'Preview',
		})

		const route = useRoute()
		const { quiz, questions } = useQuiz(route.params.id as string, { members: true })
		return { quiz, questions }
	},
})
</script>
