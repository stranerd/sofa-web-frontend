<template>
	<Quiz
		v-bind="quizProps"
		:title="isDone ? 'Practice completed' : quizProps.title"
		:showAnswer="showSolution"
		:isAnswerRight="isCorrect"
		:disabled="isDone || showSolution"
		:rightButtonConfig="
			(extras) => ({
				label: isDone || showSolution ? 'Continue' : 'Check',
				bgColor: 'bg-primaryBlue',
				textColor: 'text-white',
				click: async () => {
					if (isDone) return await Logic.Common.goBack()
					if (!showSolution) {
						await extras.submitAnswer('right', true)
						isCorrect = extras.question?.checkAnswer(extras.answer) ?? false
						return (showSolution = true)
					}
					if (extras.canNext) {
						showSolution = false
						return await extras.next()
					}
					showSolution = false
					return (isDone = true)
				},
			})
		"
		:leftButtonConfig="
			(extras) => ({
				label: isDone ? 'Restart' : showSolution ? 'Retry' : 'Previous',
				bgColor: 'bg-white border border-gray-100',
				textColor: 'text-grayColor',
				click: async () => {
					if (isDone) {
						await extras.reset()
						return (isDone = false)
					} else if (showSolution) {
						await extras.resetCurrentQuestion()
						return (showSolution = false)
					} else if (extras.canPrev) return await extras.previous()
				},
			})
		">
		<template v-if="showSolution" #header>
			<div class="w-full p-4 md:py-8 flex items-center justify-center gap-2" :class="isCorrect ? 'bg-primaryGreen' : 'bg-primaryRed'">
				<SofaIcon class="h-[22px]" :name="isCorrect ? 'white-checkbox' : 'white-wrong'" />
				<SofaHeaderText size="xl" color="text-white" :content="isCorrect ? 'Correct!' : 'Wrong!'" />
			</div>
		</template>
		<template v-if="isDone" #default>
			<div class="flex flex-col gap-1">
				<SofaHeaderText class="!font-bold md:!text-2xl text-lg" color="text-inherit" content="Congratulations!" />
				<SofaNormalText color="text-inherit" content="You have mastered this quiz" />
			</div>
		</template>
		<template v-if="showSolution" #postBody="{ extras }">
			<div class="w-full flex flex-col gap-2 items-start">
				<SofaHeaderText size="xl" content="Answer" />
				<SofaNormalText :content="extras.question?.answer" />
			</div>
			<div v-if="extras.question?.explanation" class="w-full flex flex-col gap-2 items-start">
				<SofaHeaderText size="xl" content="Explanation" />
				<SofaNormalText :content="extras.question.explanation" />
			</div>
		</template>
	</Quiz>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Quiz from '@app/components/study/quizzes/Quiz.vue'
import { PlayEntity } from '@modules/plays'
import { Logic } from 'sofa-logic'

type QuizProps = InstanceType<typeof Quiz>['$props']

defineProps<{
	play: PlayEntity
	quizProps: QuizProps
}>()

const showSolution = ref(false)
const isDone = ref(false)
const isCorrect = ref(false)
</script>
