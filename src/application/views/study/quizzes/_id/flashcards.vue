<template>
	<ExpandedLayout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<QuizWrapper :id="$route.params.id as string">
			<template #default="{ quiz, questions, extras }">
				<Quiz
					v-model:answer="extras.answer"
					:index="extras.index"
					:title="isDone ? 'Flashcards completed' : quiz.title"
					:questions="questions"
					:optionState="extras.optionState"
					:growMid="true"
					:rightButton="{
						label: isDone ? 'Continue' : 'Mastered',
						bgColor: isDone ? 'bg-primaryBlue' : 'bg-primaryGreen',
						textColor: 'text-white',
						click: () => {
							if (isDone) return Logic.Common.goBack()
							if (extras.canNext) return extras.next()
							return (isDone = true)
						},
					}"
					:leftButton="{
						label: isDone ? 'Restart' : 'Show later',
						bgColor: isDone ? 'bg-white border border-gray-100' : 'bg-primaryBlue',
						textColor: isDone ? 'text-grayColor' : 'text-white',
						click: () => {
							if (isDone) {
								extras.reset()
								return (isDone = false)
							}
							return extras.moveCurrrentQuestionToEnd()
						},
					}">
					<template #default>
						<div v-if="isDone" class="flex flex-col gap-1 w-full h-full items-center justify-center">
							<SofaHeaderText class="!font-bold md:!text-2xl text-lg" color="text-inherit" content="Congratulations!" />
							<SofaNormalText color="text-inherit" content="You have mastered all flashcards" />
						</div>
						<Flashcard v-else-if="extras.question" :key="extras.question.id" :question="extras.question" :isDark="false" />
					</template>
				</Quiz>
			</template>
		</QuizWrapper>
	</ExpandedLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'
import Flashcard from '@app/components/study/quizzes/FlashcardDisplay.vue'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'QuizIdFlashcardsPage',
	components: {
		Flashcard,
	},
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Flashcards',
		})

		const isDone = ref(false)

		return { isDone, Logic }
	},
})
</script>
