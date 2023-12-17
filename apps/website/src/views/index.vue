<template>
	<dashboard-layout>
		<template v-slot:left-session>
			<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex items-center gap-3">
					<SofaAvatar size="84" :photoUrl="user.bio.photo?.link" />

					<div class="flex flex-col gap-1">
						<div class="flex items-center gap-1">
							<SofaHeaderText class="!text-base !font-bold" :content="user.bio.name.full" />
							<SofaIcon v-if="user.roles.isVerified" name="verify" class="h-[13px]" />
							<SofaIcon v-if="user.type?.type === 'teacher'" name="tutor-bagde" class="h-[13px]" />
						</div>
						<SofaNormalText class="capitalize" color="text-grayColor" :content="user.type?.type ?? 'student'" />
						<SofaNormalText color="text-primaryPink" as="router-link" to="/profile" content="View Profile" />
					</div>
				</div>

				<div class="w-full grid grid-cols-2 gap-3" v-if="userType.isStudent">
					<div class="p-3 rounded-custom bg-lightGray col-span-1 flex gap-3 justify-start items-center">
						<SofaIcon class="h-[40px]" name="xp-points" />
						<div class="flex flex-col items-start justify-center">
							<SofaNormalText class="font-bold">
								{{ Logic.Common.convertToMoney(user.account.rankings.overall.value, false, "") }} xp
							</SofaNormalText>
							<SofaNormalText color="text-bodyBlack" content="Point" />
						</div>
					</div>
					<div class="p-3 rounded-custom bg-lightGray col-span-1 flex gap-3 justify-start items-center">
						<SofaIcon class="h-[40px]" name="streak-new" />
						<div class="flex flex-col items-start justify-center">
							<SofaNormalText class="font-bold">{{ user.account.streak.count }} days</SofaNormalText>
							<SofaNormalText color="text-bodyBlack">Streak</SofaNormalText>
						</div>
					</div>
				</div>
			</div>

			<div v-if="!user.roles.isVerified" class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col items-start gap-3">
				<div class="w-full flex gap-2 items-center">
					<SofaNormalText class="!font-bold" content="Get verified" />
					<SofaIcon name="verify" class="h-[16px]" />
				</div>
				<SofaNormalText>
					Join the elite that create the highest quality study materials, reach
					more audience, and sell on marketplace.
				</SofaNormalText>

				<SofaButton :hasShadow="false" padding="py-2 px-6" @click="Logic.Common.GoToRoute('/verification')">
					Apply here
				</SofaButton>
			</div>

			<div v-if="userType.isTeacher && user.tutor.topics.length === 0"
				class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col items-start gap-3">
				<div class="w-full flex gap-2 items-center">
					<SofaNormalText class="!font-bold" content="Apply to teach subjects" />
					<SofaIcon name="tutor-bagde" class="h-[16px]" />
				</div>
				<SofaNormalText>
					As a teacher, you need to pass a test on a subject before you can be recommended to teach the subject to others.
					Complete your test after this application and we will reach out to you with your result.
				</SofaNormalText>

				<SofaButton :hasShadow="false" padding="py-2 px-6" @click="Logic.Common.GoToRoute('/verification/tutor')">
					Apply here
				</SofaButton>
			</div>
		</template>

		<template v-slot:middle-session>
			<div v-if="profileSteps.find((s) => !s.isDone)"
				class="w-full mdlg:shadow-custom mdlg:p-4 pl-4 py-1 mdlg:!bg-white rounded-2xl flex flex-col mdlg:gap-4 gap-1">
				<div class="w-full flex gap-2 items-center">
					<SofaNormalText class="!font-bold" content="Complete your account setup" />
				</div>

				<div
					class="mdlg:flex-col mdlg:gap-4 flex gap-3 mdlg:p-0 py-2 pr-4 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
					<SofaIconCard v-for="item in profileSteps" :key="item.title" :data="item" @click="item.action?.()"
						class="flex-shrink-0">
						<template v-slot:title>
							<SofaNormalText customClass="!font-bold" :content="item.title" />
						</template>
					</SofaIconCard>
				</div>
			</div>

			<div v-if="studyMaterialsSteps.find((s) => !s.isDone)"
				class="w-full mdlg:shadow-custom mdlg:p-4 pl-4 py-1 mdlg:!bg-white rounded-2xl flex flex-col mdlg:gap-4 gap-1">
				<div class="w-full flex gap-2 items-center">
					<SofaNormalText class="!font-bold" content="Create study materials" />
				</div>

				<div
					class="mdlg:flex-col mdlg:gap-4 flex gap-3 mdlg:p-0 py-2 pr-4 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
					<SofaIconCard v-for="item in studyMaterialsSteps" :key="item.title" :data="item" @click="item.action?.()"
						class="flex-shrink-0">
						<template v-slot:title>
							<SofaNormalText customClass="!font-bold" :content="item.title" />
						</template>
					</SofaIconCard>
				</div>
			</div>

			<div v-if="takeOnTasks.find((s) => !s.isDone) && userType.isStudent"
				class="w-full mdlg:shadow-custom mdlg:p-4 pl-4 py-1 mdlg:!bg-white rounded-2xl flex flex-col mdlg:gap-4 gap-1">
				<div class="w-full flex gap-2 items-center">
					<SofaNormalText class="!font-bold" content="Take on some tasks" />
				</div>

				<div
					class="mdlg:flex-col mdlg:gap-4 flex gap-3 mdlg:p-0 py-2 pr-4 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
					<SofaIconCard v-for="item in takeOnTasks" :key="item.title" :data="item" @click="item.action?.()"
						class="flex-shrink-0">
						<template v-slot:title>
							<SofaNormalText customClass="!font-bold" :content="item.title" />
						</template>
					</SofaIconCard>
				</div>
			</div>

			<div class="w-full mdlg:shadow-custom mdlg:p-4 pl-4 py-1 mdlg:bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex gap-2 pr-4 mdlg:pr-0 items-center justify-between">
					<SofaNormalText class="!font-bold" content="Suggested for you" />
					<router-link class="mdlg:hidden" to="/marketplace">
						<SofaNormalText color="text-primaryPink" content="View all" />
					</router-link>
				</div>

				<div v-if="suggestedMaterials.length"
					class="mdlg:flex-col mdlg:gap-4 flex gap-3 mdlg:p-0 py-2 pr-4 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
					<SofaActivityCard v-for="activity in suggestedMaterials.slice(4)" as="router-link" :key="activity.id"
						:activity="activity" :to="activity.route" :hasBookmark="true" :bookmarkAction="() => saveToFolder(activity)"
						class="flex-shrink-0" />
				</div>
				<SofaEmptyState v-else title="No suggested materials" subTitle="We could not find any suggested materials"
					customClass="!h-[230px] mr-4 mdlg:mr-0" />

				<router-link v-if="suggestedMaterials.length" class="pr-4 mdlg:!pr-0 hidden mdlg:inline" to="/marketplace">
					<SofaNormalText color="text-primaryPink" content="View all" />
				</router-link>
			</div>

			<div class="w-full mdlg:shadow-custom mdlg:p-4 pl-4 py-1 mdlg:bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex gap-2 pr-4 mdlg:pr-0 items-center justify-between">
					<SofaNormalText class="!font-bold" content="Recent study materials" />
					<router-link class="mdlg:hidden" to="/marketplace">
						<SofaNormalText color="text-primaryPink" content="View all" />
					</router-link>
				</div>

				<div v-if="recentMaterials.length"
					class="mdlg:flex-col mdlg:gap-4 flex gap-3 mdlg:p-0 py-2 pr-4 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
					<SofaActivityCard v-for="activity in recentMaterials.slice(4)" as="router-link" :key="activity.id"
						:activity="activity" :to="activity.route" :hasBookmark="true" :bookmarkAction="() => saveToFolder(activity)"
						class="flex-shrink-0" />
				</div>
				<SofaEmptyState v-else title="No recent materials" subTitle="We could not find any recent materials"
					customClass="!h-[230px] mr-4 mdlg:mr-0" />

				<router-link v-if="recentMaterials.length" class="pr-4 mdlg:!pr-0 hidden mdlg:inline" to="/marketplace">
					<SofaNormalText color="text-primaryPink" content="View all" />
				</router-link>
			</div>

			<div v-if="myOrgsMaterials.length"
				class="w-full mdlg:shadow-custom mdlg:p-4 pl-4 py-1 mdlg:bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex gap-2 pr-4 mdlg:pr-0 items-center justify-between">
					<SofaNormalText class="!font-bold" content="From your organizations" />
					<router-link class="mdlg:hidden" to="/marketplace">
						<SofaNormalText color="text-primaryPink" content="View all" />
					</router-link>
				</div>

				<div v-if="myOrgsMaterials.length"
					class="mdlg:flex-col mdlg:gap-4 flex gap-3 mdlg:p-0 py-2 pr-4 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
					<SofaActivityCard v-for="activity in myOrgsMaterials.slice(4)" as="router-link" :key="activity.id"
						:activity="activity" :to="activity.route" :hasBookmark="true" :bookmarkAction="() => saveToFolder(activity)"
						class="flex-shrink-0" />
				</div>
				<SofaEmptyState v-else title="No materials found"
					subTitle="We could not find any materials from yuor organizations" customClass="!h-[230px] mr-4 mdlg:mr-0" />

				<router-link v-if="myOrgsMaterials.length" class="pr-4 mdlg:!pr-0 hidden mdlg:inline" to="/marketplace">
					<SofaNormalText color="text-primaryPink" content="View all" />
				</router-link>
			</div>

			<div class="w-full mdlg:shadow-custom px-4 mdlg:p-0 mdlg:bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex flex-col gap-3 justify-center items-center py-9 px-6 rounded-lg bg-primaryPurple">
					<SofaIcon class="h-[28px]" name="white-search" />
					<div class="w-full flex flex-col gap-2 justify-center items-center py-2">
						<SofaNormalText color="text-white" class="!font-bold" content="Discover more" />
						<SofaNormalText color="text-white" class="!font-semibold">
							There are lots of quizzes and courses that you can learn from, so start searching!
						</SofaNormalText>
					</div>
					<SofaButton bgColor="bg-white" padding="py-1 px-3" textColor="text-deepGray"
						@click="Logic.Common.GoToRoute('/marketplace')">
						Explore more
					</SofaButton>
				</div>
			</div>

			<router-link
				class="fixed bottom-[80px] right-2 z-[100] px-3 py-2 bg-primaryPurple text-white flex mdlg:hidden items-center rounded-custom gap-2"
				style="box-shadow: 0px 4px 8px rgba(120, 130, 140, 0.05)" to="/chats/new">
				<SofaNormalText color="text-inherit" content="Ask me anything" />
				<SofaIcon name="robot" class="w-[24px] h-[24px]" />
			</router-link>
		</template>

		<template v-slot:right-session>
			<div v-if="userType.isStudent" class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex items-center gap-3">
					<img :src="userAi.image" alt="" class="w-[84px] aspect-square rounded-full">
					<div class="flex flex-col gap-1">
						<SofaHeaderText class="!text-base !font-bold" :content="userAi.name" />
						<SofaNormalText :content="userAi.tagline" />
						<SofaNormalText color="text-primaryPink" as="a" content="Customise" @click="showCustomizeAI = true" />
					</div>
				</div>

				<SofaTextField placeholder="What can I do for you?" padding="p-3" customClass="border" v-model="factory.body">
					<template v-slot:inner-suffix>
						<SofaIcon name="send" class="h-[19px] cursor-pointer" @click="createConversation" />
					</template>
				</SofaTextField>

				<div class="w-full flex items-center gap-2">
					<SofaBadge color="gray" :isInverted="true" as="a" customClass="!py-2 !px-4"
						@click="Logic.Common.GoToRoute('/quiz/create')">Create a quiz</SofaBadge>
					<SofaBadge color="gray" :isInverted="true" as="a" customClass="!py-2 !px-4"
						@click="Logic.Common.GoToRoute('/course/create')">Create a course</SofaBadge>
				</div>
			</div>

			<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4"
				v-if="(conversations.length && userType.isStudent) || userType.isTeacher">
				<SofaNormalText class="!font-bold" content="Recent chats" />

				<template v-if="conversations.length">
					<ChatList :limit="3" />

					<router-link to="/chats">
						<SofaNormalText color="text-primaryPink" content="See all" />
					</router-link>
				</template>
				<SofaEmptyState v-else title="No chat" subTitle="Your active chats will show up here" actionLabel="" />
			</div>
		</template>
	</dashboard-layout>
	<CustomizeBot :close="() => showCustomizeAI = false" v-if="showCustomizeAI" />
</template>

<script lang="ts">
import ChatList from '@/components/conversations/ChatList.vue'
import CustomizeBot from '@/components/onboarding/CustomizeBot.vue'
import { useAuth } from '@/composables/auth/auth'
import { useConversationsList, useCreateConversation } from '@/composables/conversations/conversations'
import { useHomeTasks } from '@/composables/home'
import { saveToFolder } from '@/composables/library'
import { extractContent } from '@/composables/marketplace'
import { showCustomizeAI } from '@/composables/profile'
import { useMyStudy } from '@/composables/study/study'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import {
	SofaActivityCard,
	SofaAvatar,
	SofaBadge,
	SofaButton,
	SofaEmptyState,
	SofaHeaderText,
	SofaIcon,
	SofaIconCard,
	SofaNormalText,
	SofaTextField,
} from 'sofa-ui-components'
import { computed, defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	components: {
		SofaIcon,
		SofaNormalText,
		SofaHeaderText,
		SofaButton,
		SofaBadge,
		SofaTextField,
		SofaActivityCard,
		SofaIconCard,
		SofaAvatar,
		CustomizeBot,
		SofaEmptyState,
		ChatList,
	},
	name: 'IndexPage',
	beforeRouteEnter: generateMiddlewares(['isAuthenticated', async () => useAuth().userType.value.isOrg ? '/organization/dashboard' : undefined]),
	setup () {
		useMeta({
			title: 'Home',
		})

		const { user, userType, userAi } = useAuth()
		const { conversations } = useConversationsList()
		const { factory, createConversation } = useCreateConversation()

		const { profileSteps, studyMaterialsSteps, takeOnTasks } = useHomeTasks()

		const { materials: recent } = useMyStudy('recent')
		const { materials: suggested } = useMyStudy('suggested')
		const { materials: myOrgs } = useMyStudy('myOrgs')

		const recentMaterials = computed(() => recent.value.map(extractContent))
		const suggestedMaterials = computed(() => suggested.value.map(extractContent))
		const myOrgsMaterials = computed(() => myOrgs.value.map(extractContent))

		return {
			user, userType, userAi,
			factory, createConversation, conversations,
			profileSteps, studyMaterialsSteps, takeOnTasks,
			recentMaterials, suggestedMaterials, myOrgsMaterials,
			showCustomizeAI, saveToFolder, Logic,
		}
	},
})
</script>
