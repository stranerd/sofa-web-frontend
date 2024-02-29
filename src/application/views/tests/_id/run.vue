<template>
	<ExpandedLayout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<PlayWrapper :id="$route.params.id as string" :skipParticipants="true">
			<template #default="{ play, questions: playQuestions, extras: playExtras }">
				<QuizWrapper
					v-if="playExtras.isMine"
					:id="play.quizId"
					:questions="playQuestions"
					:answers="playExtras.answers"
					:useTimer="true"
					:submit="playExtras.submit">
					<template #prestart="{ quiz, extras }">
						<div class="w-full my-auto flex flex-col gap-6 items-center">
							<SofaHeaderText content="Test is starting" size="xl" />
							<div class="w-full bg-white text-grayColor p-8 flex flex-col gap-2 items-center">
								<SofaHeaderText color="text-bodyBlack" class="!font-bold" :content="quiz.title" size="xl" />
								<SofaNormalText color="text-inherit" :content="`${playQuestions.length} questions`" size="lg" />
							</div>
							<div
								class="p-6 aspect-square min-w-[5rem] flex items-center rounded-full justify-center bg-white text-bodyBlack">
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
										<PlayTimer
											:length="questions.length"
											:current="extras.index"
											:fractionTimeLeft="extras.fractionTimeLeft" />
									</div>
								</div>
							</template>
						</Quiz>
					</template>
				</QuizWrapper>
			</template>
		</PlayWrapper>
	</ExpandedLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'TestsIdRunPage',
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Run',
		})

		return { Logic }
	},
})
</script>
