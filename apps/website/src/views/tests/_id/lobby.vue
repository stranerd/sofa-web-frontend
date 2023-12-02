<template>
	<expanded-layout layoutStyle="!w-full !justify-between !h-screen !p-0 bg-deepGray text-white" :hasTopBar="false"
		:hasBottomBar="false" :bottomPadding="false" bgImage="/images/game-bg.png">
		<TestWrapper :id="($route.params.id as string)" :skipQuestions="true">
			<template v-slot="{ test, extras: testExtras, questions }">
				<QuizWrapper :id="test.quizId" :questions="questions">
					<template v-slot="{ quiz, questions, extras }">
						<Quiz :index="extras.index" :title="quiz.title" :questions="questions" :showCounter="false"
							v-model:answer="extras.answer" :optionState="extras.optionState" :isDark="true" :rightButton="{
								label: testExtras.isMine ? 'Start' : 'Join',
								bgColor: 'bg-white border border-white',
								textColor: 'text-bodyBlack',
								click: testExtras.start
							}" :leftButton="{
								label: 'Close',
								bgColor: 'bg-deepGray border border-white',
								textColor: 'text-white',
								click: () => Logic.Common.GoToRoute('/library')
							}">
							<template v-slot:header>
								<div class="px-4 pt-4 md:pt-8 w-full flex justify-center shadow-custom">
									<div
										class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex gap-3 bg-white p-4 custom-border flex-col justify-center items-center">
										<SofaNormalText color="text-grayColor !text-center" content="You are about to take a test" />
										<SofaHeaderText :content="quiz.title" class="!text-center !font-extrabold" size="xl" />
									</div>
								</div>
							</template>

							<template v-slot>
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
import Quiz from '@/components/quizzes/Quiz.vue'
import QuizWrapper from '@/components/quizzes/QuizWrapper.vue'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { SofaHeaderText, SofaNormalText } from 'sofa-ui-components'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'TestsIdLobbyPage',
	components: { TestWrapper, QuizWrapper, Quiz, SofaHeaderText, SofaNormalText },
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup () {
		useMeta({
			title: "Lobby",
		})

		return { Logic }
	}
})
</script>