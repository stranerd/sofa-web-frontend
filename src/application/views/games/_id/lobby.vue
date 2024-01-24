<template>
	<ExpandedLayout layoutStyle="!justify-between bg-deepGray text-white" :hide="{ top: true, bottom: true }" bgImage="/images/game-bg.png">
		<GameWrapper :id="$route.params.id as string" :skipQuestions="true">
			<template #default="{ game, extras: gameExtras, questions: gameQuestions, participants }">
				<QuizWrapper :id="game.quizId" :questions="gameQuestions">
					<template #default="{ quiz, questions, extras }">
						<Quiz
							v-model:answer="extras.answer"
							:index="extras.index"
							:title="quiz.title"
							:questions="questions"
							:showCounter="false"
							:optionState="extras.optionState"
							:isDark="true"
							:rightButton="{
								label: gameExtras.isMine ? 'Start' : 'Join',
								bgColor: 'bg-white border border-white',
								textColor: 'text-bodyBlack',
								disabled: gameExtras.isMine ? !gameExtras.canStart : !gameExtras.canJoin,
								click: async () => {
									if (gameExtras.isMine) return await gameExtras.start()
									else return await gameExtras.join(true)
								},
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
										class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex gap-3 bg-white text-deepGray p-4 rounded-custom"
										:class="{ 'flex-col justify-center items-center': gameExtras.isMine }">
										<template v-if="gameExtras.isMine">
											<SofaNormalText color="text-grayColor !text-center" content="You are hosting the quiz game" />
											<SofaHeaderText :content="quiz.title" class="!text-center !font-extrabold" size="xl" />

											<div class="w-full flex items-center justify-center gap-4">
												<a class="gap-2 items-center flex" @click="share(quiz)">
													<SofaIcon class="h-[16px]" name="share" />
													<SofaNormalText color="text-inherit" content="Share" />
												</a>
												<a class="gap-2 items-center flex" @click="copy">
													<SofaIcon class="h-[16px]" name="copy" />
													<SofaNormalText color="text-inherit" content="Copy" />
												</a>
											</div>
										</template>
										<template v-else>
											<SofaImageLoader
												:photoUrl="quiz.photo?.link"
												customClass="md:!h-[90px] h-[80px] w-[120px] md:!w-[170px] rounded-custom" />
											<div class="w-full flex flex-col h-full gap-2">
												<div class="w-full flex items-center justify-between">
													<SofaHeaderText :content="quiz.title" size="xl" class="text-left !line-clamp-1" />
													<SofaIcon class="h-[16px] cursor-pointer" name="share" @click="share(quiz)" />
												</div>
												<div class="flex gap-2 items-center">
													<SofaNormalText color="text-primaryPurple" content="Game" />
													<span class="h-[5px] w-[5px] rounded-full bg-primaryPurple" />
													<SofaNormalText
														color="text-primaryPurple"
														:content="`${game.questions.length} question${
															game.questions.length > 1 ? 's' : ''
														}`" />
												</div>
												<div class="w-full flex items-start gap-2 flex-nowrap">
													<SofaAvatar size="20" :photoUrl="quiz.user.bio.photo?.link" />
													<SofaNormalText
														color="text-bodyBlack"
														class="!font-semibold"
														:content="`Hosted by ${game.user.bio.publicName}`" />
												</div>
											</div>
										</template>
									</div>
								</div>
							</template>

							<template #default>
								<div class="w-full h-full overflow-y-auto flex flex-col gap-4 my-auto py-4 items-center">
									<SofaHeaderText class="md:!text-3xl text-xl" color="text-white" content="Lobby" />
									<SofaNormalText
										color="text-white"
										class="-mt-4"
										:content="
											gameExtras.isMine
												? 'Start game when enough players have joined'
												: 'Waiting for host to start game'
										" />
									<div
										v-for="user in participants"
										:key="user.id"
										class="w-full flex items-center justify-center p-3 rounded-custom border-4 bg-white"
										:class="user.id === gameExtras.authId ? 'border-hoverBlue' : 'border-transparent'">
										<SofaNormalText
											color="text-deepGray"
											class="!font-semibold"
											:content="user.id === gameExtras.authId ? 'You' : user.publicName" />
									</div>
									<div
										v-if="participants.length == 0"
										class="w-full flex items-center justify-center p-3 rounded-custom border-2 bg-white">
										<SofaNormalText content="Waiting for players!" />
									</div>
								</div>
							</template>
						</Quiz>
					</template>
				</QuizWrapper>
			</template>
		</GameWrapper>
	</ExpandedLayout>
</template>

<script lang="ts">
import GameWrapper from '@app/components/plays/games/GameWrapper.vue'
import Quiz from '@app/components/study/quizzes/Quiz.vue'
import QuizWrapper from '@app/components/study/quizzes/QuizWrapper.vue'
import { QuizEntity } from '@modules/study'
import { Logic } from 'sofa-logic'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'GamesIdLobbyPage',
	components: { GameWrapper, QuizWrapper, Quiz },
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Lobby',
		})

		const share = async (quiz: QuizEntity) => await Logic.Common.share('Join game on SOFA', `Join and play a game on ${quiz.title}`)
		const copy = () => Logic.Common.copy(window.location.href)

		return { share, copy, Logic }
	},
})
</script>
