<template>
	<expanded-layout layoutStyle="!justify-between bg-deepGray text-white" :hide="{ top: true, bottom: true }" bgImage="/images/game-bg.png">
		<GameWrapper :id="($route.params.id as string)" :skipQuestions="true" :skipStatusNav="true">
			<template v-slot="{ game, extras: gameExtras, questions }">
				<QuizWrapper :id="game.quizId" :questions="questions">
					<template v-slot="{ quiz, questions, extras }">
						<Quiz :index="extras.index" :title="quiz.title" :questions="questions" :showCounter="false"
							v-model:answer="extras.answer" :optionState="extras.optionState" :isDark="true" :rightButton="{
								label: 'Continue',
								bgColor: 'bg-white border border-white',
								textColor: 'text-bodyBlack',
								click: () => Logic.Common.GoToRoute('/library/results?tab=games')
							}" :leftButton="gameExtras.canEnd ? {
								label: 'End',
								bgColor: 'bg-deepGray border border-white',
								textColor: 'text-white',
								click: gameExtras.end
							} : undefined">
							<template v-slot:header>
								<div />
							</template>

							<template v-slot>
								<div class="w-full h-full flex flex-col overflow-y-auto">
									<div class="flex flex-col gap-4 my-auto py-4 items-center">
										<SofaHeaderText class="md:!text-3xl text-xl" color="text-white"
											content="Scoreboard" />
										<SofaNormalText color="text-white" class="-mt-4"
											:content="game.status === 'scored' ? 'Game has ended' : game.status === 'ended' ? 'Scores are being calculated' : 'Waiting for others to finish'" />
										<div v-for="score in gameExtras.scores" :key="score.user.id"
											class="w-full flex items-center justify-between gap-2 p-4 rounded-custom bg-white border-4"
											:class="score.user.id === gameExtras.authId ? 'border-hoverBlue' : 'border-transparent'">
											<SofaNormalText color="text-deepGray" class="!font-semibold"
												:content="score.position" />
											<SofaNormalText color="text-deepGray" class="!font-semibold"
												:content="score.user.id === gameExtras.authId ? 'You' : score.user.bio.name.full" />
											<SofaIcon name="game-winner" class="h-[23px]" v-if="score.isWinner" />
											<SofaNormalText color="text-deepGray" class="!font-semibold ml-auto"
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
import Quiz from '@/components/quizzes/Quiz.vue'
import QuizWrapper from '@/components/quizzes/QuizWrapper.vue'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { SofaHeaderText, SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'GamesIdResultsPage',
	components: {
		GameWrapper, QuizWrapper, Quiz,
		SofaHeaderText, SofaNormalText, SofaIcon
	},
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup () {
		useMeta({
			title: 'Results',
		})

		return { Logic }
	}
})
</script>