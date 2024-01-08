<template>
	<expanded-layout layout-style="!justify-between" :hide="{ top: true, bottom: true }">
		<QuizWrapper :id="$route.params.id as string">
			<template #default="{ quiz, questions, extras }">
				<Quiz
					v-model:answer="extras.answer"
					:index="extras.index"
					:title="quiz.title"
					:questions="questions"
					:option-state="extras.optionState"
					:right-button="{
						label: 'Next',
						bgColor: 'bg-primaryBlue',
						textColor: 'text-white',
						disabled: !extras.canNext,
						click: extras.next,
					}"
					:left-button="{
						label: 'Prev',
						bgColor: 'bg-white border border-gray-100',
						textColor: 'text-grayColor',
						disabled: !extras.canPrev,
						click: extras.previous,
					}" />
			</template>
		</QuizWrapper>
	</expanded-layout>
</template>

<script lang="ts">
import Quiz from '@/components/quizzes/Quiz.vue'
import QuizWrapper from '@/components/quizzes/QuizWrapper.vue'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { RouteLocationNormalized } from 'vue-router'

export default defineComponent({
	name: 'QuizIdPreviewPage',
	middlewares: {
		goBackRoute: (route: RouteLocationNormalized) => `/quiz/${route.params.id}/edit`,
	},
	components: { QuizWrapper, Quiz },
	setup() {
		useMeta({
			title: 'Preview',
		})
	},
})
</script>
