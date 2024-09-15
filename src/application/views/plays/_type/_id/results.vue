<template>
	<ExpandedLayout
		:layoutStyle="`!justify-between ${isDark ? 'bg-deepGray text-white' : ''}`"
		:hide="{ top: true, bottom: true }"
		:bgImage="isDark ? '/images/plays-bg.svg' : undefined">
		<PlayWrapper :id="$route.params.id as string" :type="type" :skipQuestions="true" :skipStatusNav="true">
			<template #default="{ play, extras }">
				<div class="flex flex-col lg:w-[50%] mdlg:w-[70%] md:w-[80%] w-full h-full p-4 mdlg:p-6 gap-4">
					<div class="flex grow flex-col items-center text-bodyBlack" :class="{ '!text-white': isDark }">
						<template v-if="!play.isClosed || tab === 'leaderboard'">
							<SofaHeading size="title3" content="Scoreboard" />
							<SofaText
								class="mb-4"
								:content="
									play.isScored
										? 'Ranking based on points gained'
										: play.isEnded
											? 'Scores are being calculated'
											: 'Waiting for others to finish'
								" />
						</template>
						<SofaHeading v-if="play.isClosed && tab === 'result'" class="mb-4" size="title2" content="Your Result" />

						<div class="flex flex-col gap-2 items-center grow w-full">
							<template v-if="tab === 'leaderboard'">
								<SofaText class="mb-2">
									{{ extras.scores.length }} {{ $utils.pluralize(extras.scores.length, 'participant', 'participants') }}
								</SofaText>
								<div
									v-for="score in extras.scores"
									:key="score.user.id"
									class="w-full flex items-center justify-between gap-2 p-4 rounded-custom bg-white text-deepGray"
									:class="{ '!bg-lightBlue': score.user.id === extras.authId }">
									<SofaAvatar :photoUrl="score.user.picture" :size="$screen.desktop ? 64 : 48" />
									<div class="grow">
										<SofaHeading :content="score.user.publicName" />
										<SofaText class="text-grayColor" :content="score.position" />
										<SofaText class="text-grayColor" :content="`${score.percentage}%`" />
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
									{{ $utils.formatNumber(extras.myScore.percentage, 1) }}%
								</SofaPieChart>
								<SofaHeading size="title3" :content="extras.myScore.label" />
								<SofaHeading :content="`${extras.myScore.correct}/${play.questions.length} correct answers`" />
							</div>
						</div>
					</div>
					<div class="flex gap-4 items-center">
						<SofaButton
							v-if="!play.isClosed && extras.isMine"
							bgColor="bg-deepGray border border-white"
							textColor="text-white"
							padding="py-3 px-8"
							class="w-auto"
							@click="extras.end">
							End Now
						</SofaButton>
						<SofaButton
							v-if="play.isClosed && extras.isMine && play.hasLeaderboard"
							bgColor="bg-deepGray border border-white"
							textColor="text-white"
							padding="py-3 px-8"
							class="w-auto"
							@click="extras.exportResult">
							Export
						</SofaButton>
						<span class="grow" />
						<SofaButton
							bgColor="bg-white border border-white"
							textColor="text-bodyBlack"
							padding="py-3 px-8"
							class="w-auto"
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
import { useHead } from '@unhead/vue'
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { PlayEntity, PlayTypes } from '@modules/plays'

export default defineComponent({
	name: 'PlaysTypeIdResultsPage',
	routeConfig: {
		middlewares: [
			'isAuthenticated',
			async ({ to }) => {
				if (!Object.values(PlayTypes).includes(to.params.type as any)) return '/library'
			},
		],
	},
	setup() {
		useHead({
			title: 'Results',
		})

		const route = useRoute()
		const type = route.params.type as PlayTypes
		const isDark = computed(() => PlayEntity.isDark(type))

		const tab = ref<'leaderboard' | 'result'>(PlayEntity.hasLeaderboard(type) ? 'leaderboard' : 'result')

		return { type, isDark, tab }
	},
})
</script>
