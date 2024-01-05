<template>
	<expanded-layout
		layoutStyle="!justify-between bg-deepGray text-white"
		:hide="{ top: true, bottom: true }"
		bgImage="/images/game-bg.png">
		<GameWrapper :id="$route.params.id as string" :skipParticipants="true">
			<template v-slot="{ game, questions, extras: gameExtras }">
				<QuizWrapper
					v-if="gameExtras.isParticipant"
					:id="game.quizId"
					:questions="questions"
					:useTimer="true"
					:submit="gameExtras.submit">
					<template v-slot:prestart="{ quiz, extras }">
						<div class="w-full my-auto flex flex-col gap-6 items-center">
							<SofaHeaderText content="Game is starting" size="xl" />
							<div class="w-full bg-white text-grayColor p-8 flex flex-col gap-2 items-center">
								<SofaHeaderText color="text-bodyBlack" class="!font-bold" :content="quiz.title" size="xl" />
								<SofaNormalText color="text-inherit" :content="`${questions.length} questions`" size="lg" />
							</div>
							<div
								class="p-6 aspect-square min-w-[5rem] flex items-center rounded-full justify-center bg-white text-bodyBlack">
								<SofaHeaderText color="text-inherit" size="xl" :content="`${extras.startCountdown}`" />
							</div>
						</div>
					</template>
					<template v-slot="{ questions, extras }">
						<Quiz
							:index="extras.index"
							:title="`Question ${extras.index + 1}`"
							:showCounter="false"
							:questions="questions"
							v-model:answer="extras.answer"
							:optionState="extras.optionState"
							:isDark="true"
							:rightButton="{
								label: 'Continue',
								bgColor: 'bg-primaryBlue',
								textColor: 'text-white',
								click: extras.submitAnswer,
							}">
							<template v-slot:header>
								<div class="px-4 pt-4 md:pt-8 w-full flex justify-center">
									<div class="flex gap-2 lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full">
										<div
											v-for="i in Array.from({ length: questions.length }, (_, i) => i)"
											:key="i"
											class="w-full flex">
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
		</GameWrapper>
	</expanded-layout>
</template>

<script lang="ts">
import GameWrapper from '@/components/plays/games/GameWrapper.vue'
import Quiz from '@/components/quizzes/Quiz.vue'
import QuizWrapper from '@/components/quizzes/QuizWrapper.vue'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { SofaHeaderText, SofaNormalText } from 'sofa-ui-components'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'GamesIdRunPage',
	components: { GameWrapper, QuizWrapper, Quiz, SofaHeaderText, SofaNormalText },
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup() {
		useMeta({
			title: 'Run',
		})

		return { Logic }
	},
})
</script>
