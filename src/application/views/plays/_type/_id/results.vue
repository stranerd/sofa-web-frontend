<template>
	<ExpandedLayout
		:layoutStyle="`!justify-between ${isDark ? 'bg-deepGray text-white' : ''}`"
		:hide="{ top: true, bottom: true }"
		:bgImage="isDark ? '/images/plays-bg.svg' : undefined">
		<PlayWrapper :id="$route.params.id as string" :type="type" :skipQuestions="true" :skipStatusNav="true">
			<template #default="{ play, extras }">
				<div class="flex flex-col lg:w-[50%] mdlg:w-[70%] md:w-[80%] w-full h-full p-4 mdlg:p-6 gap-4">
					<div class="flex flex-grow flex-col items-center text-bodyBlack" :class="{ '!text-white': isDark }">
						<template v-if="!play.isClosed || tab === 'leaderboard'">
							<SofaHeaderText color="text-current" size="2xl" content="Scoreboard" />
							<SofaNormalText
								class="mb-4"
								color="text-current"
								:content="
									play.isScored
										? 'Ranking based on points gained'
										: play.isEnded
											? 'Scores are being calculated'
											: 'Waiting for others to finish'
								" />
						</template>
						<SofaHeaderText
							v-if="play.isClosed && tab === 'result'"
							class="mb-4"
							color="text-current"
							size="xl"
							content="Your Result" />

						<div class="flex flex-col gap-2 items-center flex-grow w-full">
							<template v-if="tab === 'leaderboard'">
								<SofaNormalText color="text-current" class="mb-2">
									{{ extras.scores.length }} {{ pluralize(extras.scores.length, 'participant', 'participants') }}
								</SofaNormalText>
								<div
									v-for="score in extras.scores"
									:key="score.user.id"
									class="w-full flex items-center justify-between gap-2 p-4 rounded-custom bg-white text-deepGray"
									:class="{ '!bg-lightBlue': score.user.id === extras.authId }">
									<SofaAvatar :photoUrl="score.user.picture" :size="Logic.Common.isLarge ? '64' : '48'" />
									<div class="flex-grow">
										<SofaNormalText
											color="text-current"
											class="!font-semibold truncate"
											:content="score.user.publicName" />
										<SofaNormalText color="text-grayColor" :content="score.position" />
										<SofaNormalText color="text-grayColor" :content="`${score.percentage}%`" />
									</div>
									<SofaIcon v-if="score.isWinner" name="play-winner" class="h-12" />
								</div>
							</template>
							<div v-if="tab === 'result' && extras.myScore" class="flex flex-col items-center my-auto">
								<SofaPieChart
									:data="{
										labels: ['Correct answers', 'Wrong answers'],
										datasets: [
											{
												data: [extras.myScore.percentage, 100 - extras.myScore.percentage],
												backgroundColor: [extras.myScore.bgColor, 'transparent'],
												hoverOffset: 4,
												borderRadius: 10,
											},
										],
									}"
									class="mb-2"
									textStyle="!text-3xl">
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
					<div class="flex gap-4 items-center">
						<SofaButton
							v-if="!play.isClosed"
							bgColor="bg-deepGray border border-white"
							textColor="text-white"
							padding="py-3 md:px-6"
							class="w-full mdlg:w-auto"
							@click="extras.end">
							End Now
						</SofaButton>
						<SofaButton
							bgColor="bg-white border border-white"
							textColor="text-bodyBlack"
							padding="py-3 md:px-6"
							class="w-full mdlg:w-auto mdlg:ml-auto"
							@click="
								() => {
									if (tab === 'leaderboard' && extras.myScore) return (tab = 'result')
									return $router.push(`/library/results?tab=${type}`)
								}
							">
							Continue
						</SofaButton>
					</div>
				</div>
			</template>
		</PlayWrapper>
	</ExpandedLayout>
</template>

<script lang="ts">
import { formatNumber, pluralize } from 'valleyed'
import { computed, defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
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

		return { type, isDark, tab, Logic, formatNumber, pluralize }
	},
})
</script>
