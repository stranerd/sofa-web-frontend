<template>
	<TestWrapper :id="testId" :skipStatusNav="true">
		<template #default="{ test, questions: testQuestions, extras: testExtras }">
			<QuizWrapper v-if="testExtras.isMine" :id="test.quizId" :questions="testQuestions" :useTimer="true" :submit="testExtras.submit">
				<template #prestart="{ quiz, extras }">
					<div class="w-full my-auto flex flex-col gap-6 items-center">
						<SofaHeaderText content="Test is starting" size="xl" />
						<div class="w-full bg-white text-grayColor p-8 flex flex-col gap-2 items-center">
							<SofaHeaderText color="text-bodyBlack" class="!font-bold" :content="quiz.title" size="xl" />
							<SofaNormalText color="text-inherit" :content="`${testQuestions.length} questions`" size="lg" />
						</div>
						<div class="p-6 aspect-square min-w-[5rem] flex items-center rounded-full justify-center bg-white text-bodyBlack">
							<SofaHeaderText color="text-inherit" size="xl" :content="`${extras.startCountdown}`" />
						</div>
					</div>
				</template>
				<template #default="{ questions, extras }">
					<Quiz
						v-model:answer="extras.answer"
						:index="extras.index"
						:title="`Question ${extras.index + 1}`"
						:showCounter="false"
						:isLesson="isLesson"
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
								<div class="flex gap-2 lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full">
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
	</TestWrapper>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		testId: string
		isLesson: boolean
	}>(),
	{
		isLesson: false,
	},
)
</script>
