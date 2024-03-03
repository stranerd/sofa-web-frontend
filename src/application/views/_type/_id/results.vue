<template>
	<ExpandedLayout
		:layoutStyle="`!justify-between ${isDark ? 'bg-deepGray text-white' : ''}`"
		:hide="{ top: true, bottom: true }"
		:bgImage="isDark ? '/images/plays-bg.svg' : undefined">
		<PlayWrapper :id="$route.params.id as string" :type="type" :skipQuestions="true" :skipStatusNav="true">
			<template #default="{ play, extras }">
				<div class="flex flex-col lg:w-[50%] mdlg:w-[70%] md:w-[80%] h-full">
					<div class="flex flex-grow flex-col items-center" :class="{ 'text-white': isDark }">
						<template v-if="!play.isClosed || tab === 'leaderboard'">
							<SofaHeaderText color="text-current" size="xl" content="Scoreboard" />
							<SofaNormalText
								color="text-current"
								:content="
									play.isScored
										? 'Ranking based on points gained'
										: play.isEnded
											? 'Scores are being calculated'
											: 'Waiting for others to finish'
								" />
						</template>

						<div class="flex flex-grow">
							<template v-if="tab === 'leaderboard'">
								<div
									v-for="score in extras.scores"
									:key="score.user.id"
									class="w-full flex items-center justify-between gap-2 p-4 rounded-custom bg-white text-deepGray"
									:class="{ '!bg-hoverBlue': score.user.id === extras.authId }">
									<SofaAvatar :photoUrl="score.user.picture" :size="Logic.Common.isLarge ? '64' : '56'" />
									<div class="flex-grow">
										<SofaNormalText
											color="text-current"
											class="!font-semibold truncate"
											:content="score.user.publicName" />
										<SofaNormalText color="text-grayColor" :content="`${score.percentage} points`" />
									</div>
									<SofaIcon v-if="score.isWinner" name="play-winner" class="h-full" />
								</div>
							</template>
							<div v-if="tab === 'result' && extras.myScore" class="flex flex-col items-center my-auto">
								<SofaPieChart
									:data="{
										labels: ['passed', 'failed'],
										datasets: [
											{
												data: [extras.myScore.percentage, 100 - extras.myScore.percentage],
												backgroundColor: [extras.myScore.bgColor, '#E1E6EB'],
												hoverOffset: 4,
												borderRadius: 10,
											},
										],
									}"
									class="mb-2"
									cutoutPercentage="90%"
									:textStyle="`!text-3xl ${extras.myScore.color}`">
									{{ formatNumber(extras.myScore.percentage, 1) }}%
								</SofaPieChart>
								<SofaHeaderText size="2xl" color="text-current" :content="extras.myScore.label" />
								<SofaNormalText
									color="text-current"
									class="!font-semibold"
									:content="`${extras.myScore.correct}/${play.questions.length} correct answers`" />
							</div>
						</div>
					</div>
					<div class="p-4 flex gap-4 justify-between">
						<SofaButton
							v-if="!play.isClosed"
							bgColor="bg-deepGray border border-white"
							textColor="text-white"
							class="w-full md:w-auto"
							@click="extras.end">
							End Now
						</SofaButton>
						<SofaButton
							v-if="play.isClosed && tab === 'leaderboard'"
							bgColor="bg-deepGray border border-white"
							textColor="text-white"
							class="w-full md:w-auto"
							@click="extras.myScore ? $router.push(`/library/results?tab=${type}`) : (tab = 'result')">
							Continue
						</SofaButton>
						<SofaButton
							v-if="play.isClosed && tab === 'result'"
							bgColor="bg-deepGray border border-white"
							textColor="text-white"
							class="w-full md:w-auto"
							@click="$router.push(`/library/results?tab=${type}`)">
							Continue
						</SofaButton>
					</div>
				</div>
			</template>
		</PlayWrapper>
	</ExpandedLayout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import { formatNumber } from 'valleyed'
import { Logic } from 'sofa-logic'
import { PlayEntity, PlayTypes } from '@modules/plays'

export default defineComponent({
	name: 'PlaysTypeIdResultPage',
	routeConfig: {
		middlewares: [
			'isAuthenticated',
			async ({ to }) => {
				if (!Object.values(PlayTypes).includes(to.params.type as any)) return '/library'
			},
		],
	},
	setup() {
		useMeta({
			title: 'Results',
		})

		const route = useRoute()
		const type = route.params.type as PlayTypes
		const isDark = computed(() => PlayEntity.isDark(type))

		const tab = ref<'leaderboard' | 'result'>(PlayEntity.hasLeaderboard(type) ? 'leaderboard' : 'result')

		return { type, isDark, tab, Logic, formatNumber }
	},
})
</script>
