<template>
	<PlayWrapper :id="playId" :type="type" :skipStatusNav="true" :skipParticipants="true">
		<template #default="{ play, questions: playQuestions, extras: playExtras }">
			<QuizWrapper
				v-if="playExtras.isParticipant"
				:id="play.quizId"
				:questions="playQuestions"
				:answers="playExtras.answers"
				:useTimer="true"
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
				<template #default="{ questions, extras }">
					<Quiz
						v-model:answer="extras.answer"
						:index="extras.index"
						:isDark="dark"
						:title="`Question ${extras.index + 1}`"
						:showCounter="false"
						:isInModal="true"
						:questions="questions"
						:optionState="extras.optionState"
						:rightButton="{
							label: 'Continue',
							bgColor: 'bg-primaryBlue',
							textColor: 'text-white',
							click: extras.submitAnswer,
						}">
						<template #header>
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
					</Quiz>
				</template>
			</QuizWrapper>
		</template>
	</PlayWrapper>
</template>

<script lang="ts" setup>
import Quiz from '@app/components/study/quizzes/Quiz.vue'
import QuizWrapper from '@app/components/study/quizzes/QuizWrapper.vue'
import { PlayTypes } from '@modules/plays'

defineProps<{
	playId: string
	type: PlayTypes
	dark?: InstanceType<typeof Quiz>['$props']['isDark']
	access?: InstanceType<typeof QuizWrapper>['$props']['access']
}>()
</script>
