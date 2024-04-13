<template>
	<ExpandedLayout
		layoutStyle="!justify-between bg-deepGray text-white"
		:hide="{ top: true, bottom: true }"
		bgImage="/images/plays-bg.svg">
		<PlayWrapper :id="$route.params.id as string" :type="PlayTypes.assessments" :skipQuestions="true">
			<template #default="{ play, extras, questions, participants }">
				<Quiz
					:title="play.title"
					:questions="questions"
					:showCounter="false"
					:isDark="play.isDark"
					:rightButtonConfig="
						() => ({
							label: extras.isMine ? 'Start' : 'Join',
							bgColor: 'bg-white border border-white',
							textColor: 'text-bodyBlack',
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
							bgColor: 'bg-deepGray border border-white',
							textColor: 'text-white',
							click: () => $router.push('/library'),
						})
					">
					<template #header>
						<div class="px-4 pt-4 md:pt-8 w-full flex justify-center shadow-custom">
							<div
								class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex gap-3 bg-white text-deepGray p-4 rounded-custom"
								:class="{ 'flex-col justify-center items-center': extras.isMine }">
								<template v-if="extras.isMine">
									<SofaNormalText color="text-grayColor !text-center" content="You are hosting this assessment" />
									<SofaHeaderText :content="play.title" class="!text-center !font-extrabold" size="xl" />

									<div class="w-full flex items-center justify-center gap-4">
										<a class="gap-2 items-center flex" @click="extras.share()">
											<SofaIcon class="h-[16px]" name="share" />
											<SofaNormalText color="text-inherit" content="Share" />
										</a>
										<a class="gap-2 items-center flex" @click="extras.copy()">
											<SofaIcon class="h-[16px]" name="copy" />
											<SofaNormalText color="text-inherit" content="Copy" />
										</a>
									</div>
								</template>
								<template v-else>
									<SofaImageLoader :photoUrl="extras.picture" customClass="h-[80px] w-[140px] rounded-custom" />
									<div class="w-full flex flex-col h-full gap-1">
										<div class="w-full flex items-center justify-between">
											<SofaHeaderText :content="play.title" size="xl" class="text-left !line-clamp-1" />
											<SofaIcon class="h-[16px]" name="share" @click="extras.share()" />
										</div>
										<div class="flex gap-2 items-center">
											<SofaNormalText color="text-primaryPurple" content="Assessment" />
											<span class="h-[5px] w-[5px] rounded-full bg-primaryPurple" />
											<SofaNormalText
												color="text-primaryPurple"
												:content="`${play.questions.length} question${play.questions.length > 1 ? 's' : ''}`" />
										</div>
										<div class="w-full flex items-start gap-2 flex-nowrap">
											<SofaAvatar :size="20" :photoUrl="play.user.bio.photo?.link" />
											<SofaNormalText
												color="text-bodyBlack"
												class="!font-semibold"
												:content="`Hosted by ${play.user.bio.publicName}`" />
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
									extras.isMine
										? 'You can start the assessment whenever. Participants can join until the deadline you specified'
										: 'Waiting for host to start assessment'
								" />
							<div
								v-for="user in participants"
								:key="user.id"
								class="w-full flex items-center justify-center p-3 rounded-custom border-4 bg-white"
								:class="user.id === extras.authId ? 'border-lightBlue' : 'border-transparent'">
								<SofaNormalText
									color="text-deepGray"
									class="!font-semibold"
									:content="user.id === extras.authId ? 'You' : user.publicName" />
							</div>
							<div
								v-if="participants.length == 0"
								class="w-full flex items-center justify-center p-3 rounded-custom border-2 bg-white">
								<SofaNormalText content="Waiting for participants!" />
							</div>
						</div>
					</template>
				</Quiz>
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
	name: 'PlaysAssessmentsIdLobbyPage',
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Lobby',
		})

		return { Logic, PlayTypes }
	},
})
</script>
