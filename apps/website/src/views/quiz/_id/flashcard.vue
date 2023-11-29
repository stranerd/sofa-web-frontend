<template>
	<expanded-layout layoutStyle="!w-full !justify-between !h-screen !p-0" :hasTopBar="false" :hasBottomBar="false"
		:bottomPadding="false">
		<QuizWrapper :id="($route.params.id as string)">
			<template v-slot="{ quiz, questions, extras }">
				<Quiz v-model:index="extras.index" :title="isDone ? 'Flashcards completed' : quiz.title" v-model:answer="extras.answer"
					:questions="questions" :optionState="extras.optionState"
					:rightButton="{
						label: isDone ? 'Continue' : 'Mastered',
						bgColor: isDone ? 'bg-primaryBlue' : 'bg-primaryGreen',
						textColor: 'text-white',
						click: () => {
							if (isDone) return Logic.Common.goBack()
							if (extras.index < questions.length - 1) return extras.index++
							return isDone = true
						}
					}" :leftButton="{
						label: isDone ? 'Restart' : 'Show later',
						bgColor: isDone ? 'bg-white border-[1px] border-gray-100' : 'bg-primaryBlue',
						textColor: isDone ? 'text-grayColor' : 'text-white',
						click: () => {
							if (isDone) {
								extras.index = 0
								return isDone = false
							}
							// TODO: move current question to end of list
							if (extras.index < questions.length - 1) return extras.index++
						}
					}">
					<template v-slot>
						<div v-if="isDone" class="flex flex-col gap-1">
							<SofaHeaderText class="!font-bold md:!text-2xl text-lg" color="text-inherit" content="Congratulations!" />
							<SofaNormalText color="text-inherit" content="You have mastered all flashcards" />
						</div>
						<Flashcard v-else-if="extras.question" :key="extras.question.id" :question="extras.question" :isDark="false" />
					</template>
				</Quiz>
			</template>
		</QuizWrapper>
	</expanded-layout>
</template>

<script lang="ts">
import Quiz from '@/components/quizzes/Quiz.vue'
import QuizWrapper from '@/components/quizzes/QuizWrapper.vue'
import Flashcard from '@/components/quizzes/FlashcardDisplay.vue'
import { SofaHeaderText, SofaNormalText } from 'sofa-ui-components'
import { Logic } from 'sofa-logic'
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'QuizIdFlashcardPage',
	components: { QuizWrapper, Quiz, Flashcard, SofaHeaderText, SofaNormalText },
	setup () {
		useMeta({
			title: "Flashcards",
		})

		const isDone = ref(false)

		return { isDone, Logic }
	}
})
</script>