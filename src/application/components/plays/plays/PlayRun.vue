<template>
	<PlayWrapper :id="playId" :type="type" :skipStatusNav="true" :skipParticipants="true">
		<template #default="{ play, questions: playQuestions, extras: playExtras }">
			<QuizWrapper
				v-if="playExtras.isParticipant"
				:questions="playQuestions"
				:answers="playExtras.answers"
				:useTimer="play.isTimed"
				:timing="play.timing"
				:totalTime="play.totalTimeInSec"
				:start="playExtras.startQuiz"
				:submit="playExtras.submitAnswer">
				<template #default="{ questions, extras }">
					<PlayFlashcard v-if="play.isFlashcards()" :play="play" :questions="questions" :extras="extras" />
					<PlayPractice v-else-if="play.isPractice()" :play="play" :questions="questions" :extras="extras" />
					<Quiz
						v-else
						v-model:answer="extras.answer"
						:index="extras.index"
						:isDark="play.isDark"
						:title="`Question ${extras.index + 1} of ${play.questions.length}`"
						:showCounter="false"
						:isInModal="isInModal"
						:questions="questions"
						:leftButton="undefined"
						:rightButton="{
							label: 'Continue',
							bgColor: 'bg-primaryBlue',
							textColor: 'text-white',
							click: () => extras.submitAnswer('right', false),
						}">
						<template #prestart="{ extras }">
							<div class="w-full my-auto flex flex-col gap-6 items-center">
								<div class="w-full bg-white text-grayColor p-8 flex flex-col gap-2 items-center">
									<SofaHeaderText color="text-bodyBlack" class="!font-bold" :content="play.title" size="xl" />
									<SofaNormalText color="text-inherit" :content="`${playQuestions.length} questions`" size="lg" />
								</div>
								<SofaHeaderText content="starting in" size="xl" />
								<div
									class="p-6 aspect-square min-w-[5rem] flex items-center rounded-full justify-center bg-white text-bodyBlack">
									<SofaHeaderText color="text-inherit" size="xl" :content="`${extras.startCountdown}`" />
								</div>
							</div>
						</template>
						<template #header>
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
import PlayWrapper from './PlayWrapper.vue'
import PlayFlashcard from './types/PlayFlashcard.vue'
import PlayPractice from './types/PlayPractice.vue'
import Quiz from '@app/components/study/quizzes/Quiz.vue'
import QuizWrapper from '@app/components/study/quizzes/QuizWrapper.vue'
import { PlayTypes } from '@modules/plays'

defineProps<{
	playId: string
	type: PlayTypes
	isInModal?: boolean
}>()
</script>
