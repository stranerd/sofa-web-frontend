<template>
	<ExpandedLayout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<PlayWrapper :id="$route.params.id as string" :type="PlayTypes.tests" :skipQuestions="true">
			<template #default="{ play, extras: playExtras, questions: playQuestions }">
				<QuizWrapper :id="play.quizId" :questions="playQuestions">
					<template #default="{ quiz, questions, extras }">
						<Quiz
							v-model:answer="extras.answer"
							:index="extras.index"
							:title="quiz.title"
							:questions="questions"
							:showCounter="false"
							:isDark="play.isDark"
							:optionState="extras.optionState"
							:rightButton="{
								label: playExtras.isMine ? 'Start' : 'Join',
								bgColor: 'bg-white border border-white',
								textColor: 'text-bodyBlack',
								click: playExtras.start,
							}"
							:leftButton="{
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
										<SofaNormalText color="text-inherit" :content="`${play.questions.length} questions`" />
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
		</PlayWrapper>
	</ExpandedLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { Logic } from 'sofa-logic'
import { PlayTypes } from '@modules/plays'

export default defineComponent({
	name: 'PlaysTestsIdLobbyPage',
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Lobby',
		})

		return { Logic, PlayTypes }
	},
})
</script>
