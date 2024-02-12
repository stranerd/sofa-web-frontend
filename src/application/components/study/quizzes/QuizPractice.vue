<template>
	<div v-if="!quizStarted" class="h-full w-full bg-primaryPurple flex flex-col items-center justify-center gap-3 rounded-custom">
		<SofaHeaderText color="text-white"> Practice questions </SofaHeaderText>
		<SofaNormalText color="text-white"> Comfortable learning for topic mastery </SofaNormalText>
		<SofaNormalText color="text-white">{{ quizInst.questions.length + ' Questions' }}</SofaNormalText>
		<SofaButton bgColor="bg-white" textColor="text-primaryBlue" padding="py-3 px-9" customClass="font-bold" @click="startQuiz">
			{{ 'Start' }}
		</SofaButton>
	</div>
	<div v-else class="h-full w-full bg-lightGray rounded-custom overflow-y-auto">
		<QuizWrapper :id="quizInst.id" :showAnswer="showSolution" :isAnswerRight="isCorrect">
			<template #default="{ quiz, questions, extras }">
				<Quiz
					v-model:answer="extras.answer"
					:index="extras.index"
					:isLesson="true"
					:title="isDone ? 'Practice completed' : quiz.title"
					:questions="questions"
					:optionState="extras.optionState"
					:rightButton="{
						label: isDone || showSolution ? 'Continue' : 'Check',
						bgColor: 'bg-primaryBlue',
						textColor: 'text-white',
						click: () => {
							if (isDone) {
								useModals().organizations.viewCurriculumItem.close()
							}
							if (!showSolution) {
								isCorrect = extras.question?.checkAnswer(extras.answer) ?? false
								return (showSolution = true)
							}
							if (extras.canNext) {
								showSolution = false
								return extras.next()
							}
							showSolution = false
							return (isDone = true)
						},
					}"
					:leftButton="{
						label: isDone ? 'Restart' : showSolution ? 'Retry' : 'Skip',
						bgColor: 'bg-white border border-gray-100',
						textColor: 'text-grayColor',
						disabled: !isDone && extras.index === questions.length - 1,
						click: () => {
							if (isDone) {
								extras.reset()
								return (isDone = false)
							} else if (showSolution) return (showSolution = false)
							else if (extras.canNext) return extras.next()
						},
					}">
					<template v-if="showSolution" #header>
						<div
							class="w-full p-4 md:py-8 flex items-center justify-center gap-2"
							:class="isCorrect ? 'bg-primaryGreen' : 'bg-primaryRed'">
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
					<template v-if="showSolution" #postBody>
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
		</QuizWrapper>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Quiz from '@app/components/study/quizzes/Quiz.vue'
import QuizWrapper from '@app/components/study/quizzes/QuizWrapper.vue'
import { QuizEntity } from '@modules/study'
import { useModals } from '@app/composables/core/modals'
defineProps<{
	quizInst: QuizEntity
}>()
const showSolution = ref(false)
const isDone = ref(false)
const isCorrect = ref(false)

const quizStarted = ref(false)
const startQuiz = () => {
	quizStarted.value = true
}
</script>
