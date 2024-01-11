<template>
	<expanded-layout layout-style="!justify-between" :hide="{ top: true, bottom: true }">
		<TestWrapper :id="$route.params.id as string" :skip-questions="true">
			<template #default="{ test, extras: testExtras, questions: testQuestions }">
				<QuizWrapper :id="test.quizId" :questions="testQuestions">
					<template #default="{ quiz, questions, extras }">
						<Quiz
							v-model:answer="extras.answer"
							:index="extras.index"
							:title="quiz.title"
							:questions="questions"
							:show-counter="false"
							:option-state="extras.optionState"
							:right-button="{
								label: testExtras.isMine ? 'Start' : 'Join',
								bgColor: 'bg-white border border-white',
								textColor: 'text-bodyBlack',
								click: testExtras.start,
							}"
							:left-button="{
								label: 'Close',
								bgColor: 'bg-deepGray border border-white',
								textColor: 'text-white',
								click: () => Logic.Common.GoToRoute('/library'),
							}">
							<template #header>
								<div class="px-4 pt-4 md:pt-8 w-full flex justify-center shadow-custom">
									<div
										class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex gap-3 bg-white text-deepGray p-4 rounded-custom flex-col justify-center items-center">
										<SofaNormalText color="text-inherit" content="You are about to take a test" />
										<SofaHeaderText :content="quiz.title" color="text-inherit" class="!font-extrabold" size="xl" />
										<SofaNormalText color="text-inherit" :content="`${test.questions.length} questions`" />
									</div>
								</div>
							</template>

							<template #default>
								<div />
							</template>
						</Quiz>
					</template>
				</QuizWrapper>
			</template>
		</TestWrapper>
	</expanded-layout>
</template>

<script lang="ts">
import TestWrapper from '@/components/plays/tests/TestWrapper.vue'
import Quiz from '@/components/study/quizzes/Quiz.vue'
import QuizWrapper from '@/components/study/quizzes/QuizWrapper.vue'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { SofaHeaderText, SofaNormalText } from 'sofa-ui-components'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'TestsIdLobbyPage',
	components: { TestWrapper, QuizWrapper, Quiz, SofaHeaderText, SofaNormalText },
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup() {
		useMeta({
			title: 'Lobby',
		})

		return { Logic }
	},
})
</script>
