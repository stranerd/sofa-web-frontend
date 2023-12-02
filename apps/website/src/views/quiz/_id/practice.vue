<template>
	<expanded-layout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<QuizWrapper :id="($route.params.id as string)" :showAnswer="showSolution" :isAnswerRight="isCorrect">
			<template v-slot="{ quiz, questions, extras }">
				<Quiz :index="extras.index" :title="isDone ? 'Practice completed' : quiz.title" v-model:answer="extras.answer"
					:questions="questions" :optionState="extras.optionState"
					:rightButton="{
						label: isDone || showSolution ? 'Continue' : 'Check',
						bgColor: 'bg-primaryBlue',
						textColor: 'text-white',
						click: () => {
							if (isDone) return Logic.Common.goBack()
							if (!showSolution) {
								isCorrect = Logic.Study.checkAnswer(extras.question, extras.answer)
								return showSolution = true
							}
							if (extras.canNext) {
								showSolution = false
								return extras.next()
							}
							showSolution = false
							return isDone = true
						}
					}" :leftButton="{
						label: isDone ? 'Restart' : showSolution ? 'Retry' : 'Skip',
						bgColor: 'bg-white border border-gray-100',
						textColor: 'text-grayColor',
						disabled: !isDone && extras.index === questions.length - 1,
						click: () => {
							if (isDone) {
								extras.reset()
								return isDone = false
							}
							else if (showSolution) return showSolution = false
							else if (extras.canNext) return extras.next()
						}
					}">
					<template v-if="showSolution" v-slot:header>
						<div class="w-full p-4 md:py-8 flex items-center justify-center gap-2" :class="isCorrect ? 'bg-primaryGreen' : 'bg-primaryRed'">
							<SofaIcon class="h-[22px]" :name="isCorrect ? 'white-checkbox' : 'white-wrong'" />
							<SofaHeaderText :size="'xl'" :color="'text-white'" :content="isCorrect ? 'Correct!' : 'Wrong!'" />
						</div>
					</template>
					<template v-if="isDone" v-slot>
						<div class="flex flex-col gap-1">
							<SofaHeaderText class="!font-bold md:!text-2xl text-lg" color="text-inherit" content="Congratulations!" />
							<SofaNormalText color="text-inherit" content="You have mastered this quiz" />
						</div>
					</template>
					<template v-if="showSolution" v-slot:postBody>
						<div class="w-full flex flex-col gap-2 items-start">
							<SofaHeaderText size="xl" content="Answer" />
							<SofaNormalText :content="extras.question.answer" />
						</div>
						<div v-if="extras.question.explanation" class="w-full flex flex-col gap-2 items-start">
							<SofaHeaderText size="xl" content="Explanation" />
							<SofaNormalText :content="extras.question.explanation" />
						</div>
					</template>
				</Quiz>
			</template>
		</QuizWrapper>
	</expanded-layout>
</template>

<script lang="ts">
import Quiz from '@/components/quizzes/Quiz.vue'
import QuizWrapper from '@/components/quizzes/QuizWrapper.vue'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { SofaHeaderText, SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'QuizIdPracticePage',
	components: { QuizWrapper, Quiz, SofaHeaderText, SofaIcon, SofaNormalText },
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup () {
		useMeta({
			title: "Practice",
		})

		const showSolution = ref(false)
		const isDone = ref(false)
		const isCorrect = ref(false)

		return { showSolution, isDone, Logic, isCorrect }
	}
})
</script>