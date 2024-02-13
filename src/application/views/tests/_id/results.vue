<template>
	<ExpandedLayout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<TestWrapper :id="$route.params.id as string" :skipQuestions="true" :skipStatusNav="true">
			<template #default="{ test, extras: testExtras, questions: testQuestions }">
				<QuizWrapper :id="test.quizId" :questions="testQuestions">
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
							:leftButton="testExtras.canEnd ? { ...leftButton, click: testExtras.end } : undefined">
							<template #header>
								<div />
							</template>

							<template #default>
								<div class="w-full h-full flex flex-col overflow-y-auto">
									<div class="flex flex-col gap-4 my-auto py-4 items-center">
										<SofaNormalText
											color="text-white"
											:content="
												test.status === 'scored'
													? ''
													: test.status === 'ended'
														? 'Scores are being calculated'
														: 'Waiting for test to finish'
											" />
										<div v-for="(score, index) in testExtras.scores" :key="index" class="flex flex-col items-center">
											<SofaPieChart
												:data="{
													labels: ['passed', 'failed'],
													datasets: [
														{
															data: [score.percent, 100 - score.percent],
															backgroundColor: [score.bgColor, '#E1E6EB'],
															hoverOffset: 4,
															borderRadius: 10,
														},
													],
												}"
												cutoutPercentage="90%"
												:textStyle="`!text-3xl ${score.color}`">
												{{ formatNumber(score.percent, 1) }}%
											</SofaPieChart>
											<SofaHeaderText class="md:!text-3xl text-xl" :content="score.label" />
											<SofaNormalText
												color="text-deepGray"
												class="!font-semibold"
												:content="`${Math.round((score.percent * test.questions.length) / 100)}/${
													test.questions.length
												} correct answers`" />
										</div>
									</div>
								</div>
							</template>
						</Quiz>
					</template>
				</QuizWrapper>
			</template>
		</TestWrapper>
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
