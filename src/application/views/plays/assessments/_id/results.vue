<template>
	<ExpandedLayout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<PlayWrapper :id="$route.params.id as string" :type="PlayTypes.assessments" :skipQuestions="true" :skipStatusNav="true">
			<template #default="{ play, extras: playExtras, questions: playQuestions }">
				<QuizWrapper :id="play.quizId" :questions="playQuestions">
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
								label: 'Continue',
								bgColor: 'bg-white border border-white',
								textColor: 'text-bodyBlack',
								click: () => Logic.Common.GoToRoute('/library/results?tab=assessments'),
							}"
							:leftButton="playExtras.canEnd ? { ...leftButton, click: playExtras.end } : undefined">
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
												play.isScored
													? 'Assessment has ended'
													: play.isEnded
														? 'Scores are being calculated'
														: 'Waiting for others to finish'
											" />
										<div
											v-for="score in playExtras.scores"
											:key="score.user.id"
											class="w-full flex items-center justify-between gap-2 p-4 rounded-custom bg-white border-4"
											:class="score.user?.id === playExtras.authId ? 'border-hoverBlue' : 'border-transparent'">
											<SofaNormalText color="text-deepGray" class="!font-semibold" :content="score.position" />
											<SofaNormalText
												color="text-deepGray"
												class="!font-semibold"
												:content="score.user?.id === playExtras.authId ? 'You' : score.user?.publicName" />
											<SofaNormalText
												color="text-deepGray"
												class="!font-semibold ml-auto"
												:content="`${score.percentage}%`" />
										</div>
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
import { PlayTypes } from '@modules/plays'

export default defineComponent({
	name: 'PlaysAssessmentsIdResultsPage',
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Results',
		})

		const leftButton = {
			label: 'End Now',
			bgColor: 'bg-deepGray border border-white',
			textColor: 'text-white',
		}

		return { Logic, leftButton, PlayTypes }
	},
})
</script>
