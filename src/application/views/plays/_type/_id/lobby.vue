<template>
	<ExpandedLayout
		:layoutStyle="`!justify-between ${isDark ? 'bg-deepGray text-white' : ''}`"
		:hide="{ top: true, bottom: true }"
		:bgImage="isDark ? `/images/plays-bg.svg` : undefined">
		<PlayWrapper :id="$route.params.id as string" :type="type" :skipQuestions="true">
			<template #default="{ play, extras, questions, participants }">
				<Quiz
					:title="play.title"
					:questions="questions"
					:showCounter="false"
					:isDark="play.isDark"
					:rightButtonConfig="
						() => ({
							label: extras.isMine ? 'Start' : 'Join',
							color: 'white',
							class: 'border border-white',
							disabled: extras.isMine ? !extras.canStart : !extras.canJoin,
							click: async () => {
								if (extras.isMine) return await extras.start()
								else return await extras.join(true)
							},
						})
					"
					:leftButtonConfig="
						() => ({
							label: 'Close',
							color: 'deepGray',
							class: 'border border-white',
							click: () => $router.push('/library'),
						})
					">
					<template #header>
						<div class="px-4 pt-4 md:pt-8 w-full flex justify-center shadow-custom">
							<template v-if="play.isGames() || play.isAssessments()">
								<div
									class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex gap-3 bg-white text-deepGray p-4 rounded-custom"
									:class="{ 'flex-col justify-center items-center': extras.isMine }">
									<template v-if="extras.isMine">
										<SofaText
											class="text-grayColor !text-center"
											:content="`You are hosting this ${play.singularizedType}`" />
										<SofaHeading :content="play.title" size="title" />

										<div class="w-full flex items-center justify-center gap-4">
											<a class="gap-2 items-center flex" @click="extras.share()">
												<SofaIcon class="h-[16px]" name="share" />
												<SofaText content="Share" />
											</a>
											<a class="gap-2 items-center flex" @click="extras.openQr()">
												<SofaIcon class="h-[16px]" name="scan" />
												<SofaText content="View QR" />
											</a>
											<a class="gap-2 items-center flex" @click="extras.copy()">
												<SofaIcon class="h-[16px]" name="copy" />
												<SofaText content="Copy" />
											</a>
										</div>
									</template>
									<template v-else>
										<SofaImageLoader :photoUrl="extras.picture" class="h-[80px] w-[140px] rounded-custom" />
										<div class="w-full flex flex-col h-full gap-1">
											<div class="w-full flex items-center justify-between">
												<SofaHeading :content="play.title" size="title" clamp />
												<SofaIcon class="h-[16px]" name="share" @click="extras.share()" />
											</div>
											<div class="flex gap-2 items-center">
												<SofaText class="text-primaryPurple capitalize" :content="play.singularizedType" />
												<span class="size-[5px] rounded-full bg-primaryPurple" />
												<SofaText
													class="text-primaryPurple"
													:content="`${play.questions.length} question${play.questions.length > 1 ? 's' : ''}`" />
											</div>
											<div class="w-full flex items-start gap-2 flex-nowrap">
												<SofaAvatar :size="20" :photoUrl="play.user.bio.photo?.link" />
												<SofaHeading
													bold
													class="text-bodyBlack"
													:content="`Hosted by ${play.user.bio.publicName}`" />
											</div>
										</div>
									</template>
								</div>
							</template>
							<div
								v-else
								class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex gap-3 bg-white text-deepGray p-4 rounded-custom flex-col justify-center items-center">
								<SofaText content="You are about to take a test" />
								<SofaHeading :content="play.title" size="title" />
								<SofaText :content="`${play.questions.length} questions`" />
							</div>
						</div>
					</template>

					<template #default>
						<div
							v-if="play.isGames() || play.isAssessments()"
							class="w-full h-full overflow-y-auto flex flex-col gap-4 my-auto py-4 items-center">
							<SofaHeading size="title" color="text-white" content="Lobby" />
							<SofaText
								class="-mt-4 text-white"
								:content="
									extras.isMine
										? play.isAssessments()
											? 'You can start the assessment whenever. Participants can join until the deadline you specified'
											: 'Start game when enough players have joined'
										: `Waiting for host to start ${play.singularizedType}`
								" />
							<div
								v-for="user in participants"
								:key="user.id"
								class="w-full flex items-center justify-center p-3 rounded-custom border-4 bg-white"
								:class="user.id === extras.authId ? 'border-lightBlue' : 'border-transparent'">
								<SofaText bold class="text-deepGray" :content="user.id === extras.authId ? 'You' : user.publicName" />
							</div>
							<div
								v-if="participants.length == 0"
								class="w-full flex items-center justify-center p-3 rounded-custom border-2 bg-white">
								<SofaText content="Waiting for participants!" />
							</div>
						</div>
						<div v-else />
					</template>
				</Quiz>
			</template>
		</PlayWrapper>
	</ExpandedLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { PlayEntity, PlayTypes } from '@modules/plays'

export default defineComponent({
	name: 'PlaysTypeIdLobbyPage',
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
			title: 'Lobby',
		})

		const route = useRoute()
		const type = route.params.type as PlayTypes
		const isDark = computed(() => PlayEntity.isDark(type))
		return { type, isDark }
	},
})
</script>
