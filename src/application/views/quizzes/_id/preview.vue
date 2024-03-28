<template>
	<ExpandedLayout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<QuizWrapper :id="$route.params.id as string">
			<template #default="{ quiz, questions, extras }">
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
import { RouteLocationNormalized } from 'vue-router'

export default defineComponent({
	name: 'QuizIdPreviewPage',
	routeConfig: {
		goBackRoute: (route: RouteLocationNormalized) => `/quizzes/${route.params.id}/edit`,
		middlewares: ['isAuthenticated'],
	},
	setup() {
		useMeta({
			title: 'Preview',
		})
	},
})
</script>
