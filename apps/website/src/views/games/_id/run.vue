<template>
	<expanded-layout layoutStyle="!w-full !justify-between !h-screen !p-0 bg-deepGray" :hasTopBar="false"
		:hasBottomBar="false" :bottomPadding="false" bgImage="/images/game-bg.png">
		<GameWrapper :id="($route.params.id as string)" :skipParticipants="true" :skipStatusNav="true">
			<template v-slot="{ game, questions, extras: gameExtras }">
				<QuizWrapper v-if="gameExtras.isParticipant" :id="game.quizId" :questions="questions">
					<template v-slot="{ quiz, questions }">
						<Quiz v-model:index="gameExtras.index" :title="quiz.title" :questions="questions"
							v-model:answer="gameExtras.answer" :optionState="gameExtras.optionState" :isDark="true" :rightButton="{
								label: 'Continue',
								bgColor: 'bg-primaryBlue',
								textColor: 'text-white',
								click: gameExtras.continue
							}">
							<template v-slot:header>
								<div />
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
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'GamesIdRunPage',
	components: { GameWrapper, QuizWrapper, Quiz },
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup () {
		useMeta({
			title: "Run",
		})

		return { Logic }
	}
})
</script>