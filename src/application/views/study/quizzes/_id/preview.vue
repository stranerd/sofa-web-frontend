<template>
	<ExpandedLayout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<Quiz
			v-if="quiz"
			:title="quiz.title"
			:questions="questions"
			:rightButtonConfig="
				(extras) => ({
					label: 'Next',
					color: 'blue',
					disabled: !extras.canNext,
					click: extras.next,
				})
			"
			:leftButtonConfig="
				(extras) => ({
					label: 'Prev',
					color: 'white',
					class: 'border border-gray-100',
					disabled: !extras.canPrev,
					click: extras.previous,
				})
			" />
	</ExpandedLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useQuiz } from '@app/composables/study/quizzes'
import Quiz from '@app/components/study/quizzes/Quiz.vue'

export default defineComponent({
	name: 'StudyQuizzesIdPreviewPage',
	components: { Quiz },
	routeConfig: {
		goBackRoute: (route) => `/study/quizzes/${route.params.id}/edit`,
		middlewares: ['isAuthenticated'],
	},
	setup() {
		useHead({
			title: 'Preview',
		})

		const route = useRoute()
		const { quiz, questions } = useQuiz(route.params.id as string, { members: true })
		return { quiz, questions }
	},
})
</script>
