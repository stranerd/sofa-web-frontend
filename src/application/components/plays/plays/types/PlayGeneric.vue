<template>
	<Quiz
		v-bind="quizProps"
		:showCounter="false"
		:rightButtonConfig="
			(extras) => ({
				label: 'Continue',
				bgColor: 'bg-primaryBlue',
				textColor: 'text-white',
				click: () => extras.submitAnswer('right', false),
			})
		">
		<template #prestart="{ extras }">
			<div class="w-full my-auto flex flex-col gap-6 items-center">
				<div class="w-full bg-white text-grayColor p-8 flex flex-col gap-2 items-center">
					<SofaHeaderText color="text-bodyBlack" class="!font-bold" :content="play.title" size="xl" />
					<SofaNormalText color="text-inherit" :content="`${quizProps.questions.length} questions`" size="lg" />
				</div>
				<SofaHeaderText content="starting in" size="xl" />
				<div class="p-6 aspect-square min-w-[5rem] flex items-center rounded-full justify-center bg-white text-bodyBlack">
					<SofaHeaderText color="text-inherit" size="xl" :content="`${extras.startCountdown}`" />
				</div>
			</div>
		</template>
		<template #header="{ extras }">
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

<script lang="ts" setup>
import Quiz from '@app/components/study/quizzes/Quiz.vue'
import { PlayEntity } from '@modules/plays'

type QuizProps = InstanceType<typeof Quiz>['$props']

defineProps<{
	play: PlayEntity
	quizProps: QuizProps
}>()
</script>
