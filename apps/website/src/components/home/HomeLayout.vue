<template>
	<sub-page-layout v-if="!index && !Logic.Common.isLarge">
		<div class="w-full h-full flex-1 flex flex-col justify-start relative">
			<div class="w-full flex items-center gap-3 justify-between bg-lightGray p-4">
				<SofaIcon class="h-[15px]" name="back-arrow" @click="Logic.Common.goBack()" />
				<SofaNormalText class="!font-bold !text-base" :content="title" />
				<span class="w-4" />
			</div>

			<div class="w-full flex flex-col gap-3 px-4 h-full overflow-y-auto">
				<slot :user="user!" :extras="extras" />
			</div>
		</div>
	</sub-page-layout>
	<dashboard-layout v-else :topbarOptions="{ title }">
		<template v-slot:left-session>
			<div class="w-full shadow-custom bg-white rounded-2xl flex flex-col p-4 gap-4">
				<div class="w-full flex items-center gap-3">
					<SofaAvatar size="84" :photoUrl="user.bio.photo?.link" />

					<div class="flex flex-col gap-1">
						<div class="flex items-center gap-1">
							<SofaHeaderText class="!text-base" :content="user.orgName" />
							<SofaIcon v-if="user.roles.isVerified" name="verify" class="h-[13px]" />
							<SofaIcon v-if="user.type?.type === 'teacher'" name="tutor-bagde" class="h-[13px]" />
						</div>
						<SofaNormalText class="capitalize" color="text-grayColor" :content="userType.type" />
						<SofaNormalText color="text-primaryPink" as="router-link" to="/profile" content="View Profile" />
					</div>
				</div>

				<div class="w-full grid grid-cols-2 gap-3" v-if="userType.isStudent">
					<div class="p-3 rounded-custom bg-lightGray col-span-1 flex gap-3 justify-start items-center">
						<SofaIcon class="h-[40px]" name="xp-points" />
						<div class="flex flex-col items-start justify-center">
							<SofaNormalText class="font-bold">
								{{ Logic.Common.formatNumber(user.account.rankings.overall.value, 2) }} xp
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

				<template v-else>
					<div class="h-[1px] w-full bg-lightGray" />

					<div class="w-full flex flex-col gap-1">
						<router-link
							class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-deepGray hover:bg-lightBlue"
							v-for="item in options"
							:key="item.route"
							:to="item.route"
							exact-active-class="bg-lightBlue font-semibold">
							<SofaIcon :name="item.icon" class="h-[17px] fill-current" />
							<SofaNormalText color="text-inherit" :content="item.title" />
						</router-link>
					</div>
				</template>
			</div>
		</template>

		<template v-slot:middle-session>
			<div class="flex flex-col gap-4 h-full overflow-y-auto">
				<slot :user="user!" :extras="extras" />
			</div>
		</template>

		<template v-slot:right-session>
			<div v-if="userType.isStudent" class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex items-center gap-3">
					<img :src="userAi.image" alt="" class="w-[84px] aspect-square rounded-full" />
					<div class="flex flex-col gap-1">
						<SofaHeaderText class="!text-base !font-bold" :content="userAi.name" />
						<SofaNormalText :content="userAi.tagline" />
						<SofaNormalText color="text-primaryPink" as="a" content="Customize" @click="showCustomizeAi = true" />
					</div>
				</div>

				<SofaTextField placeholder="What can I do for you?" customClass="border" v-model="factory.body">
					<template v-slot:inner-suffix>
						<SofaIcon name="send" class="h-[19px] cursor-pointer" @click="createConversation" />
					</template>
				</SofaTextField>

				<div class="w-full flex items-center gap-2">
					<SofaBadge
						color="gray"
						:isInverted="true"
						as="a"
						customClass="!py-2 !px-4"
						@click="Logic.Common.GoToRoute('/quiz/create')">
						Create a quiz
					</SofaBadge>
					<SofaBadge
						color="gray"
						:isInverted="true"
						as="a"
						customClass="!py-2 !px-4"
						@click="Logic.Common.GoToRoute('/course/create')">
						Create a course
					</SofaBadge>
				</div>
			</div>

			<div
				class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4"
				v-if="(conversations.length && userType.isStudent) || userType.isTeacher">
				<SofaNormalText class="!font-bold" content="Recent chats" />

				<template v-if="conversations.length">
					<ChatList :limit="3" />
					<SofaNormalText color="text-primaryPink" as="router-link" to="/chats" content="See all" />
				</template>
				<SofaEmptyState v-else title="No chat" subTitle="Your active chats will show up here" actionLabel="" />
			</div>

			<div v-if="userType.isOrg" class="w-full shadow-custom bg-white rounded-2xl flex flex-col gap-4 p-6">
				<SofaHeaderText class="!text-lg !font-bold" content="Start something" />

				<div class="grid grid-cols-2 gap-y-2 gap-x-4">
					<SofaBadge
						v-for="command in rightCommands"
						:key="command.label"
						color="gray"
						:isInverted="true"
						as="a"
						class="!py-3 !px-4 truncate"
						@click="command.action">
						{{ command.label }}
					</SofaBadge>
				</div>
			</div>

			<div v-if="!user.roles.isVerified" class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col items-start gap-3">
				<div class="w-full flex gap-2 items-center">
					<SofaNormalText class="!font-bold" content="Get verified" />
					<SofaIcon name="verify" class="h-[16px]" />
				</div>
				<SofaNormalText>
					Join the elite that create the highest quality study materials, reach more audience, and sell on marketplace.
				</SofaNormalText>

				<SofaButton :hasShadow="false" padding="py-2 px-6" @click="$router.push('/verification')"> Apply here </SofaButton>
			</div>

			<div
				v-if="userType.isTeacher && user.tutor.topics.length === 0"
				class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col items-start gap-3">
				<div class="w-full flex gap-2 items-center">
					<SofaNormalText class="!font-bold" content="Apply to teach subjects" />
					<SofaIcon name="tutor-bagde" class="h-[16px]" />
				</div>
				<SofaNormalText>
					As a teacher, you need to pass a test on a subject before you can be recommended to teach the subject to others.
					Complete your test after this application and we will reach out to you with your result.
				</SofaNormalText>

				<SofaButton :hasShadow="false" padding="py-2 px-6" @click="$router.push('/verification/tutor')"> Apply here </SofaButton>
			</div>
		</template>
	</dashboard-layout>
	<CustomizeBot :close="() => (showCustomizeAi = false)" v-if="showCustomizeAi" />
	<SofaModal v-if="addModalType">
		<div class="flex flex-col p-4 gap-4 md:p-6 md:gap-6 justify-between">
			<div class="flex gap-2 justify-between items-center">
				<SofaHeaderText :content="addModalType === MemberTypes.teacher ? 'Add teachers' : 'Add students'" />
				<SofaIcon class="h-[19px]" name="circle-close" @click="addModalType = null" />
			</div>
			<div v-if="addModalType === MemberTypes.student" class="bg-primaryPurple text-white flex items-center gap-2 p-4 rounded-custom">
				<SofaIcon class="h-[16px] fill-current" name="info" />
				<SofaNormalText color="text-inherit" content="Students added get your classes, courses, and quizzes for FREE" />
				<SofaIcon class="h-[16px] fill-current ml-auto" name="circle-close" />
			</div>
			<div class="flex gap-2 items-center">
				<SofaTextField
					customClass="!bg-lightGray"
					v-model="addMembersEmails"
					name="Emails"
					placeholder="Email, comma seperated"
					borderColor="border-transparent" />
				<SofaButton
					customClass="font-semibold"
					padding="py-3 px-6"
					bgColor="bg-primaryBlue"
					textColor="text-white"
					@click="addMembers(addModalType).then((succeeded) => (succeeded ? (addModalType = null) : null))">
					Invite
				</SofaButton>
			</div>
			<div class="bg-darkLightGray h-[1px] w-full" />
			<div class="flex gap-4 justify-between items-center">
				<a class="text-primaryBlue flex items-center gap-1" @click="copy">
					<SofaIcon class="w-[16px] fill-current" name="copy" />
					<SofaNormalText color="text-inherit" content="Copy" />
				</a>
				<a class="text-primaryBlue flex items-center gap-1" @click="share">
					<SofaIcon class="w-[16px] fill-current" name="share" />
					<SofaNormalText color="text-inherit" content="Share" />
				</a>
			</div>
		</div>
	</SofaModal>
</template>

<script setup lang="ts">
import ChatList from '@/components/conversations/ChatList.vue'
import CustomizeBot from '@/components/onboarding/CustomizeBot.vue'
import { useAuth } from '@/composables/auth/auth'
import { useConversationsList, useCreateConversation } from '@/composables/conversations/conversations'
import { useManageOrganizationMembers } from '@/composables/organizations/members'
import { showCustomizeAi } from '@/composables/users/profile'
import { MemberTypes } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import {
	SofaAvatar,
	SofaBadge,
	SofaButton,
	SofaEmptyState,
	SofaHeaderText,
	SofaIcon,
	SofaModal2 as SofaModal,
	SofaNormalText,
	SofaTextField,
} from 'sofa-ui-components'
import { computed, defineProps, ref } from 'vue'
import { useMeta } from 'vue-meta'

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	index: {
		type: Boolean,
		required: false,
		default: false,
	},
})

useMeta(
	computed(() => ({
		title: props.title,
	})),
)

const rightCommands = [
	{ label: 'Add a student', action: () => extras.value.openAddModal(MemberTypes.student) },
	{ label: 'Add a teacher', action: () => extras.value.openAddModal(MemberTypes.teacher) },
	{ label: 'Create a quiz', action: () => Logic.Common.GoToRoute('/quiz/create') },
	{ label: 'Create a course', action: () => Logic.Common.GoToRoute('/course/create') },
	//{ label: 'Create a class', action: () => Logic.Common.GoToRoute('/organzation/classes/create') },
]

const { id, user, userAi, userType } = useAuth()
const { addMembersEmails, addMembers, removeMember, acceptMember } = useManageOrganizationMembers(id.value)
const { conversations } = useConversationsList()
const { factory, createConversation } = useCreateConversation()

const options = computed(() => [
	{ title: 'Dashboard', icon: 'dashboard', route: '/' },
	//{ title: 'Classes', icon: 'classes', route: '/classes' },
	...(userType.value.isOrg
		? [
				{ title: 'Teachers', icon: 'tutor', route: '/organization/teachers' },
				{ title: 'Students', icon: 'user-unfilled', route: '/organization/students' },
			]
		: []),
])

const addModalType = ref<MemberTypes | null>(null)

const extras = computed(() => ({
	isAdmin: user.value?.id === id.value,
	openAddModal: (type: MemberTypes) => (addModalType.value = type),
	removeMember,
	acceptMember,
}))

const shareUrl = `${window.location.origin}/profile/${id.value}`
const share = async () => await Logic.Common.share('Join organization', `Join to become a member of ${user.value?.orgName ?? ''}`, shareUrl)
const copy = () => Logic.Common.copy(shareUrl)
</script>
