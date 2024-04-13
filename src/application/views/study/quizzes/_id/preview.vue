<template>
	<ExpandedLayout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<QuizWrapper v-if="quiz" :questions="questions">
			<template #default="{ extras }">
				<Quiz
					v-model:answer="extras.answer"
					:index="extras.index"
					:title="quiz.title"
					:questions="questions"
					:optionState="extras.optionState"
					:rightButton="{
						label: 'Next',
						bgColor: 'bg-primaryBlue',
						textColor: 'text-white',
						disabled: !extras.canNext,
						click: extras.next,
					}"
					:leftButton="{
						label: 'Prev',
						bgColor: 'bg-white border border-gray-100',
						textColor: 'text-grayColor',
						disabled: !extras.canPrev,
						click: extras.previous,
					}" />
			</template>
		</QuizWrapper>
	</ExpandedLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import { useQuiz } from '@app/composables/study/quizzes'

export default defineComponent({
	name: 'QuizIdPreviewPage',
	routeConfig: {
		goBackRoute: (route) => `/study/quizzes/${route.params.id}/edit`,
		middlewares: ['isAuthenticated'],
	},
	setup() {
		useMeta({
			title: 'Preview',
		})

		const route = useRoute()
		const id = route.params.id as string
		const { quiz, questions } = useQuiz(id, { members: true })

		return { quiz, questions }
	},
})
</script>
