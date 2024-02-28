<template>
	<ExpandedLayout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<PlayWrapper :id="$route.params.id as string" :skipQuestions="true" :skipStatusNav="true">
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
							:rightButton="{
								label: 'Continue',
								bgColor: 'bg-white border border-white',
								textColor: 'text-bodyBlack',
								click: () => Logic.Common.GoToRoute('/library/results?tab=tests'),
							}"
							:leftButton="playExtras.canEnd ? { ...leftButton, click: playExtras.end } : undefined">
							<template #header>
								<div />
							</template>

							<template #default>
								<div class="w-full h-full flex flex-col overflow-y-auto">
									<div class="flex flex-col gap-4 my-auto py-4 items-center">
										<SofaNormalText
											color="text-white"
											:content="
												play.status === 'scored'
													? ''
													: play.status === 'ended'
														? 'Scores are being calculated'
														: 'Waiting for test to finish'
											" />
										<div v-for="(score, index) in playExtras.scores" :key="index" class="flex flex-col items-center">
											<SofaPieChart
												:data="{
													labels: ['passed', 'failed'],
													datasets: [
														{
															data: [score.percentage, 100 - score.percentage],
															backgroundColor: [score.bgColor, '#E1E6EB'],
															hoverOffset: 4,
															borderRadius: 10,
														},
													],
												}"
												cutoutPercentage="90%"
												:textStyle="`!text-3xl ${score.color}`">
												{{ formatNumber(score.percentage, 1) }}%
											</SofaPieChart>
											<SofaHeaderText class="md:!text-3xl text-xl" :content="score.label" />
											<SofaNormalText
												color="text-deepGray"
												class="!font-semibold"
												:content="`${Math.round((score.percentage * play.questions.length) / 100)}/${
													play.questions.length
												} correct answers`" />
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
import { formatNumber } from 'valleyed'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'TestsIdResultsPage',
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

		return { Logic, leftButton, formatNumber }
	},
})
</script>
