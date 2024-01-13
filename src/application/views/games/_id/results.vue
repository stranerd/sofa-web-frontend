<template>
	<expanded-layout
		layout-style="!justify-between bg-deepGray text-white"
		:hide="{ top: true, bottom: true }"
		bg-image="/images/game-bg.png">
		<GameWrapper :id="$route.params.id as string" :skip-questions="true" :skip-status-nav="true">
			<template #default="{ game, extras: gameExtras, questions: gameQuestions }">
				<QuizWrapper :id="game.quizId" :questions="gameQuestions">
					<template #default="{ quiz, questions, extras }">
						<Quiz
							v-model:answer="extras.answer"
							:index="extras.index"
							:title="quiz.title"
							:questions="questions"
							:show-counter="false"
							:option-state="extras.optionState"
							:is-dark="true"
							:right-button="{
								label: 'Continue',
								bgColor: 'bg-white border border-white',
								textColor: 'text-bodyBlack',
								click: () => Logic.Common.GoToRoute('/library/results?tab=games'),
							}"
							:left-button="gameExtras.canEnd ? { ...leftButton, click: gameExtras.end } : undefined">
							<template #header>
								<div />
							</template>

							<template #default>
								<div class="w-full h-full flex flex-col overflow-y-auto">
									<div class="flex flex-col gap-4 my-auto py-4 items-center">
										<SofaHeaderText class="md:!text-3xl text-xl" color="text-white" content="Scoreboard" />
										<SofaNormalText
											color="text-white"
											class="-mt-4"
											:content="
												game.status === 'scored'
													? 'Game has ended'
													: game.status === 'ended'
														? 'Scores are being calculated'
														: 'Waiting for others to finish'
											" />
										<div
											v-for="score in gameExtras.scores"
											:key="score.user.id"
											class="w-full flex items-center justify-between gap-2 p-4 rounded-custom bg-white border-4"
											:class="score.user.id === gameExtras.authId ? 'border-hoverBlue' : 'border-transparent'">
											<SofaNormalText color="text-deepGray" class="!font-semibold" :content="score.position" />
											<SofaNormalText
												color="text-deepGray"
												class="!font-semibold"
												:content="score.user.id === gameExtras.authId ? 'You' : score.user.bio.name.full" />
											<SofaIcon v-if="score.isWinner" name="game-winner" class="h-[23px]" />
											<SofaNormalText
												color="text-deepGray"
												class="!font-semibold ml-auto"
												:content="`${score.score} pts`" />
										</div>
									</div>
								</div>
							</template>
						</Quiz>
					</template>
				</QuizWrapper>
			</template>
		</GameWrapper>
	</expanded-layout>
</template>

<script lang="ts">
import GameWrapper from '@/components/plays/games/GameWrapper.vue'
import Quiz from '@/components/study/quizzes/Quiz.vue'
import QuizWrapper from '@/components/study/quizzes/QuizWrapper.vue'
import { Logic } from 'sofa-logic'
import { SofaHeaderText, SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'GamesIdResultsPage',
	components: {
		GameWrapper,
		QuizWrapper,
		Quiz,
		SofaHeaderText,
		SofaNormalText,
		SofaIcon,
	},
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Results',
		})

		const leftButton = {
			label: 'End',
			bgColor: 'bg-deepGray border border-white',
			textColor: 'text-white',
		}

		return { Logic, leftButton }
	},
})
</script>
