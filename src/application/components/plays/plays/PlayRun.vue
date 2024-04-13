<template>
	<PlayWrapper :id="playId" :type="type" :skipStatusNav="true" :skipParticipants="true">
		<template #default="{ play, questions: playQuestions, extras: playExtras }">
			<QuizWrapper
				v-if="playExtras.isParticipant"
				:showAnswer="showSolution"
				:isAnswerRight="isCorrect"
				:questions="playQuestions"
				:answers="playExtras.answers"
				:useTimer="play.isTimed"
				:timing="play.timing"
				:totalTime="play.totalTimeInSec"
				:start="playExtras.startQuiz"
				:submit="playExtras.submitAnswer">
				<template #prestart="{ extras }">
					<div class="w-full my-auto flex flex-col gap-6 items-center">
						<div class="w-full bg-white text-grayColor p-8 flex flex-col gap-2 items-center">
							<SofaHeaderText color="text-bodyBlack" class="!font-bold" :content="play.title" size="xl" />
							<SofaNormalText color="text-inherit" :content="`${playQuestions.length} questions`" size="lg" />
						</div>
						<SofaHeaderText content="starting in" size="xl" />
						<div class="p-6 aspect-square min-w-[5rem] flex items-center rounded-full justify-center bg-white text-bodyBlack">
							<SofaHeaderText color="text-inherit" size="xl" :content="`${extras.startCountdown}`" />
						</div>
					</div>
				</template>
				<template #default="{ questions, extras }">
					<PlayFlashcard v-if="play.isFlashcards()" :play="play" :questions="questions" :extras="extras" />
					<Quiz
						v-else
						v-model:answer="extras.answer"
						:index="extras.index"
						:isDark="play.isDark"
						:title="generateQuizTitle(play, extras)"
						:showCounter="play.isPractice()"
						:isInModal="isInModal"
						:questions="questions"
						:optionState="extras.optionState"
						:leftButton="generateLeftButton(play, questions.length, extras, playExtras)"
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
							<div class="px-4 pt-4 md:pt-8 w-full flex">
								<div class="flex lg:w-[50%] mdlg:w-[70%] md:w-[80%] w-full mx-auto">
									<div
										class="h-2 bg-primaryGreen rounded-l-full"
										:class="{ 'w-full rounded-full': extras.fractionTimeLeft === 1 }"
										:style="`width: ${extras.fractionTimeLeft * 100}%;`" />
									<div
										class="h-2 bg-darkLightGray rounded-r-full"
										:class="{ 'w-full rounded-full': extras.fractionTimeLeft === 0 }"
										:style="`width: ${(1 - extras.fractionTimeLeft) * 100}%;`" />
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
			<div v-else-if="play.canJoinAfterStart && playExtras.canJoin" class="flex flex-col h-full items-center justify-center gap-4">
				<SofaHeaderText
					:color="play.isDark ? 'test-white' : undefined"
					class="capitalize"
					:content="`${play.singularizedType} already started`" />
				<div class="flex gap-4 items-center">
					<SofaButton class="px-6 py-3" @click="playExtras.join(true)">Join Now</SofaButton>
					<SofaButton class="px-6 py-3" @click="$router.replace(play.resultsPage)">Wait for Results</SofaButton>
				</div>
			</div>
			<div v-else class="flex flex-col h-full items-center justify-center gap-4">
				<SofaNormalText :content="`You cannot join this ${play.singularizedType} anymore`" />
			</div>
		</template>
	</PlayWrapper>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PlayWrapper from './PlayWrapper.vue'
import PlayFlashcard from './types/PlayFlashcard.vue'
import Quiz from '@app/components/study/quizzes/Quiz.vue'
import QuizWrapper from '@app/components/study/quizzes/QuizWrapper.vue'
import { PlayEntity, PlayTypes } from '@modules/plays'

defineProps<{
	playId: string
	type: PlayTypes
	isInModal?: boolean
}>()

const router = useRouter()

const showSolution = ref(false)
const isDone = ref(false)
const isCorrect = ref(false)

type PlayWrapperExtras = Parameters<Exclude<InstanceType<typeof PlayWrapper>['$slots']['default'], undefined>>[0]['extras']
type QuizWrapperExtras = Parameters<Exclude<InstanceType<typeof QuizWrapper>['$slots']['default'], undefined>>[0]['extras']

const generateLeftButton = (play: PlayEntity, questionsLength: number, extras: QuizWrapperExtras, playExtras: PlayWrapperExtras) => {
	if (play.isPractice())
		return {
			label: isDone.value ? 'Restart' : showSolution.value ? 'Retry' : 'Skip',
			bgColor: 'bg-white border border-gray-100',
			textColor: 'text-grayColor',
			disabled: !isDone.value && extras.index === questionsLength - 1,
			click: async () => {
				// restart clicked
				if (isDone.value) {
					await playExtras.resetAnswer()
					extras.reset()
					return (isDone.value = false)
				}
				// retry clicked
				else if (showSolution.value) return (showSolution.value = false)
				// skip clicked
				else if (extras.canNext) {
					extras.answer.value = null
					return await extras.submitAnswer('right', false)
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
					return await router.push('/library/results')
				}
				// check clicked
				if (!showSolution.value) {
					isCorrect.value = extras.question?.checkAnswer(extras.answer) ?? false
					await extras.submitAnswer('right', true)
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
		click: () => extras.submitAnswer('right', false),
	}
}

const generateQuizTitle = (play: PlayEntity, extras: QuizWrapperExtras) => {
	if (play.isPractice()) return isDone.value ? 'Practice completed' : play.title
	return `Question ${extras.index + 1} of ${play.questions.length}`
}
</script>
