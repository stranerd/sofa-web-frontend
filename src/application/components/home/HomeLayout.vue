<template>
	<sub-page-layout v-if="!index && !Logic.Common.isLarge">
		<div class="w-full h-full flex-1 flex flex-col justify-start relative">
			<div class="w-full flex items-center gap-3 justify-between bg-lightGray p-4">
				<SofaIcon class="h-[15px]" name="back-arrow" @click="Logic.Common.goBack()" />
				<SofaNormalText class="!font-bold !text-base" :content="title" />
				<span class="w-4" />
			</div>

			<div class="w-full flex flex-col gap-3 px-4 h-full overflow-y-auto">
				<slot :user="user!" />
			</div>
		</div>
	</sub-page-layout>
	<dashboard-layout v-else :topbar-options="{ title }">
		<template #left-session>
			<div class="w-full shadow-custom bg-white rounded-2xl flex flex-col p-4 gap-4">
				<div v-if="user" class="w-full flex items-center gap-3">
					<SofaAvatar size="84" :photo-url="user.bio.photo?.link" />

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

				<div v-if="user && userType.isStudent" class="w-full grid grid-cols-2 gap-3">
					<div class="p-3 rounded-custom bg-lightGray col-span-1 flex gap-3 justify-start items-center">
						<SofaIcon class="h-[40px]" name="xp-points" />
						<div class="flex flex-col items-start justify-center">
							<SofaNormalText class="font-bold">
								{{ formatNumber(user.account.rankings.overall.value, 2) }} xp
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
							v-for="item in options"
							:key="item.route"
							class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-deepGray hover:bg-lightBlue"
							:to="item.route"
							exact-active-class="bg-lightBlue font-semibold">
							<SofaIcon :name="item.icon" class="h-[17px] fill-current" />
							<SofaNormalText color="text-inherit" :content="item.title" />
						</router-link>
					</div>
				</template>
			</div>
		</template>

		<template #middle-session>
			<div class="flex flex-col gap-4 h-full overflow-y-auto">
				<slot :user="user!" />
			</div>
		</template>

		<template #right-session>
			<div v-if="userType.isStudent" class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex items-center gap-3">
					<img :src="userAi.image" alt="" class="w-[84px] aspect-square rounded-full" />
					<div class="flex flex-col gap-1">
						<SofaHeaderText class="!text-base !font-bold" :content="userAi.name" />
						<SofaNormalText :content="userAi.tagline" />
						<SofaNormalText color="text-primaryPink" as="a" content="Customize" @click="customizeAi" />
					</div>
				</div>

				<SofaTextField v-model="factory.body" placeholder="What can I do for you?" custom-class="border">
					<template #inner-suffix>
						<SofaIcon name="send" class="h-[19px] cursor-pointer" @click="createConversation" />
					</template>
				</SofaTextField>

				<div class="w-full flex items-center gap-2">
					<SofaBadge
						color="gray"
						:is-inverted="true"
						as="a"
						custom-class="!py-2 !px-4"
						@click="Logic.Common.GoToRoute('/quiz/create')">
						Create a quiz
					</SofaBadge>
					<SofaBadge
						color="gray"
						:is-inverted="true"
						as="a"
						custom-class="!py-2 !px-4"
						@click="Logic.Common.GoToRoute('/course/create')">
						Create a course
					</SofaBadge>
				</div>
			</div>

			<div
				v-if="(conversations.length && userType.isStudent) || userType.isTeacher"
				class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4">
				<SofaNormalText class="!font-bold" content="Recent chats" />

				<template v-if="conversations.length">
					<ChatList :limit="3" />
					<SofaNormalText color="text-primaryPink" as="router-link" to="/chats" content="See all" />
				</template>
				<SofaEmptyState v-else title="No chat" sub-title="Your active chats will show up here" action-label="" />
			</div>

			<div v-if="userType.isOrg" class="w-full shadow-custom bg-white rounded-2xl flex flex-col gap-4 p-6">
				<SofaHeaderText class="!text-lg !font-bold" content="Start something" />

				<div class="grid grid-cols-2 gap-y-2 gap-x-4">
					<SofaBadge
						v-for="command in rightCommands"
						:key="command.label"
						color="gray"
						:is-inverted="true"
						as="a"
						class="!py-3 !px-4 truncate"
						@click="command.action">
						{{ command.label }}
					</SofaBadge>
				</div>
			</div>

			<div v-if="!user?.roles.isVerified" class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col items-start gap-3">
				<div class="w-full flex gap-2 items-center">
					<SofaNormalText class="!font-bold" content="Get verified" />
					<SofaIcon name="verify" class="h-[16px]" />
				</div>
				<SofaNormalText>
					Join the elite that create the highest quality study materials, reach more audience, and sell on marketplace.
				</SofaNormalText>

				<SofaButton :has-shadow="false" padding="py-2 px-6" @click="$router.push('/verification')"> Apply here </SofaButton>
			</div>

			<div
				v-if="userType.isTeacher && user?.tutor.topics.length === 0"
				class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col items-start gap-3">
				<div class="w-full flex gap-2 items-center">
					<SofaNormalText class="!font-bold" content="Apply to teach subjects" />
					<SofaIcon name="tutor-bagde" class="h-[16px]" />
				</div>
				<SofaNormalText>
					As a teacher, you need to pass a test on a subject before you can be recommended to teach the subject to others.
					Complete your test after this application and we will reach out to you with your result.
				</SofaNormalText>

				<SofaButton :has-shadow="false" padding="py-2 px-6" @click="$router.push('/verification/tutor')"> Apply here </SofaButton>
			</div>
		</template>
	</dashboard-layout>
</template>

<script setup lang="ts">
import ChatList from '@app/components/conversations/ChatList.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useConversationsList, useCreateConversation } from '@app/composables/conversations/conversations'
import { useModals } from '@app/composables/core/modals'
import { MemberTypes } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import { computed } from 'vue'
import { useMeta } from 'vue-meta'
import { formatNumber } from 'valleyed'

const props = withDefaults(
	defineProps<{
		title: string
		index: boolean
	}>(),
	{
		index: false,
	},
)

useMeta(
	computed(() => ({
		title: props.title,
	})),
)

const { id, user, userAi, userType } = useAuth()
const { conversations } = useConversationsList()
const { factory, createConversation } = useCreateConversation()

const customizeAi = () => useModals().users.customizeAi.open({})

const rightCommands = computed(() => [
	{ label: 'Add a student', action: () => useModals().organizations.addMember.open({ type: MemberTypes.student, org: user.value! }) },
	{ label: 'Add a teacher', action: () => useModals().organizations.addMember.open({ type: MemberTypes.teacher, org: user.value! }) },
	{ label: 'Create a quiz', action: () => Logic.Common.GoToRoute('/quiz/create') },
	{ label: 'Create a course', action: () => Logic.Common.GoToRoute('/course/create') },
	...(userType.value.isOrg
		? [{ label: 'Create a class', action: () => useModals().organizations.createClass.open({ organizationId: id.value }) }]
		: []),
])

const options = computed(() => [
	{ title: 'Dashboard', icon: 'dashboard', route: '/' },
	...(userType.value.isOrg
		? [
				{ title: 'Classes', icon: 'classes', route: '/organization/classes' },
				{ title: 'Teachers', icon: 'tutor', route: '/organization/teachers' },
				{ title: 'Students', icon: 'user-unfilled', route: '/organization/students' },
			]
		: []),
])
</script>
