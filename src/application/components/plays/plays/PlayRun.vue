<template>
	<PlayWrapper :id="playId" :type="type" :skipStatusNav="true" :skipParticipants="true">
		<template #default="{ play, questions: playQuestions, extras: playExtras }">
			<QuizWrapper
				v-if="playExtras.isParticipant"
				:id="play.quizId"
				:showAnswer="showSolution"
				:isAnswerRight="isCorrect"
				:questions="playQuestions"
				:answers="playExtras.answers"
				:useTimer="play.isTimed"
				:submit="playExtras.submit"
				:access="access">
				<template #prestart="{ quiz, extras }">
					<div class="w-full my-auto flex flex-col gap-6 items-center">
						<div class="w-full bg-white text-grayColor p-8 flex flex-col gap-2 items-center">
							<SofaHeaderText color="text-bodyBlack" class="!font-bold" :content="quiz.title" size="xl" />
							<SofaNormalText color="text-inherit" :content="`${playQuestions.length} questions`" size="lg" />
						</div>
						<SofaHeaderText content="starting in" size="xl" />
						<div class="p-6 aspect-square min-w-[5rem] flex items-center rounded-full justify-center bg-white text-bodyBlack">
							<SofaHeaderText color="text-inherit" size="xl" :content="`${extras.startCountdown}`" />
						</div>
					</div>
				</template>
				<template #default="{ quiz, questions, extras }">
					<Quiz
						v-model:answer="extras.answer"
						:index="extras.index"
						:isDark="play.isDark"
						:title="generateQuizTitle(play, quiz, extras)"
						:showCounter="play.isPractice()"
						:isInModal="isInModal"
						:questions="questions"
						:optionState="extras.optionState"
						:leftButton="generateLeftButton(play, questions.length, extras)"
						:rightButton="generateRightButton(play, extras, playExtras)">
						<template v-if="play.isPractice()" #header>
							<template v-if="showSolution">
								<div
									class="w-full p-4 md:py-8 flex items-center justify-center gap-2"
									:class="isCorrect ? 'bg-primaryGreen' : 'bg-primaryRed'">
									<SofaIcon class="h-[22px]" :name="isCorrect ? 'white-checkbox' : 'white-wrong'" />
									<SofaHeaderText size="xl" color="text-white" :content="isCorrect ? 'Correct!' : 'Wrong!'" />
								</div>
							</template>
						</template>
						<template v-else #header>
							<div class="px-4 pt-4 md:pt-8 w-full flex justify-center">
								<div class="flex gap-2 w-full">
									<div v-for="i in Array.from({ length: questions.length }, (_, i) => i)" :key="i" class="w-full flex">
										<div
											class="h-2 bg-primaryGreen"
											:class="{
												'w-full rounded-full':
													i < extras.index || (i === extras.index && extras.fractionTimeLeft === 1),
												'w-0': i > extras.index,
												'rounded-l-full': i === extras.index,
											}"
											:style="i === extras.index ? `width: ${extras.fractionTimeLeft * 100}%;` : ''" />
										<div
											class="h-2 bg-darkLightGray"
											:class="{
												'w-full rounded-full':
													i > extras.index || (i === extras.index && extras.fractionTimeLeft === 0),
												'w-0': i < extras.index,
												'rounded-r-full': i === extras.index,
											}"
											:style="i === extras.index ? `width: ${(1 - extras.fractionTimeLeft) * 100}%;` : ''" />
									</div>
								</div>
							</div>
						</template>
						<template v-if="play.isPractice() && isDone" #default>
							<div class="flex flex-col gap-1">
								<SofaHeaderText class="!font-bold md:!text-2xl text-lg" color="text-inherit" content="Congratulations!" />
								<SofaNormalText color="text-inherit" content="You have mastered this quiz" />
							</div>
						</template>
						<template v-if="play.isPractice() && showSolution" #postBody>
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
		</template>
	</PlayWrapper>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import PlayWrapper from './PlayWrapper.vue'
import Quiz from '@app/components/study/quizzes/Quiz.vue'
import QuizWrapper from '@app/components/study/quizzes/QuizWrapper.vue'
import { PlayEntity, PlayTypes } from '@modules/plays'
import { Logic } from 'sofa-logic'
import { QuizEntity } from '@modules/study'

defineProps<{
	playId: string
	type: PlayTypes
	isInModal?: boolean
	access?: InstanceType<typeof QuizWrapper>['$props']['access']
}>()

const showSolution = ref(false)
const isDone = ref(false)
const isCorrect = ref(false)

type PlayWrapperExtras = Parameters<Exclude<InstanceType<typeof PlayWrapper>['$slots']['default'], undefined>>[0]['extras']
type QuizWrapperExtras = Parameters<Exclude<InstanceType<typeof QuizWrapper>['$slots']['default'], undefined>>[0]['extras']

const generateLeftButton = (play: PlayEntity, questionsLength: number, extras: QuizWrapperExtras) => {
	if (play.isPractice())
		return {
			label: isDone.value ? 'Restart' : showSolution.value ? 'Retry' : 'Skip',
			bgColor: 'bg-white border border-gray-100',
			textColor: 'text-grayColor',
			disabled: !isDone.value && extras.index === questionsLength - 1,
			click: async () => {
				// restart clicked
				if (isDone.value) {
					// TODO: reset answer in backend
					extras.reset()
					return (isDone.value = false)
				}
				// retry clicked
				else if (showSolution.value) return (showSolution.value = false)
				// skip clicked
				else if (extras.canNext) {
					await extras.submitAnswer(true)
					return extras.next()
				}
			},
		}
	return undefined
}

const generateRightButton = (play: PlayEntity, extras: QuizWrapperExtras, playExtras: PlayWrapperExtras) => {
	if (play.isPractice())
		return {
			label: isDone.value || showSolution.value ? 'Continue' : 'Check',
			bgColor: 'bg-primaryBlue',
			textColor: 'text-white',
			click: async () => {
				// continue clicked, but done with practice
				if (isDone.value) {
					await playExtras.end(false)
					return Logic.Common.GoToRoute('/library/results')
				}
				// check clicked
				if (!showSolution.value) {
					isCorrect.value = extras.question?.checkAnswer(extras.answer) ?? false
					await extras.submitAnswer(true)
					showSolution.value = true
					return
				}
				// continue clicked but not done with practice
				if (extras.canNext) {
					showSolution.value = false
					return extras.next()
				}
				// continue clicked, but after last question
				showSolution.value = false
				return (isDone.value = true)
			},
		}
	return {
		label: 'Continue',
		bgColor: 'bg-primaryBlue',
		textColor: 'text-white',
		click: extras.submitAnswer,
	}
}

const generateQuizTitle = (play: PlayEntity, quiz: QuizEntity, extras: QuizWrapperExtras) => {
	if (play.isPractice()) return isDone.value ? 'Practice completed' : quiz.title
	return `Question ${extras.index + 1}`
}
</script>
