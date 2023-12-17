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
						<SofaNormalText class="capitalize" color="text-grayColor" :content="user.type?.type ?? 'student'" />
						<SofaNormalText color="text-primaryPink" as="router-link" to="/profile" content="View Profile" />
					</div>
				</div>

				<div class="h-[1px] w-full bg-lightGray" />

				<div class="w-full flex flex-col gap-1">
					<router-link
						class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-deepGray hover:bg-lightBlue"
						v-for="item in options" :key="item.route" :to="item.route"
						exact-active-class="bg-lightBlue font-semibold">
						<SofaIcon :name="item.icon" class="h-[17px] fill-current" />
						<SofaNormalText color="text-inherit" :content="item.title" />
					</router-link>
				</div>
			</div>

			<div v-if="!user.roles.isVerified"
				class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col items-start gap-3">
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
		</template>

		<template v-slot:middle-session>
			<div v-if="index" class="w-full flex flex-col gap-4 px-4 mdlg:!hidden">
				<div class="bg-white flex flex-col shadow-custom rounded-custom">
					<router-link :to="item.route" class="w-full flex items-center gap-3 p-4 border-b border-lightGray"
						v-for="item in options" :key="item.route">
						<SofaIcon :name="item.icon" class="h-[16px] fill-current" />
						<SofaNormalText color="text-inherit" :content="item.title" />
					</router-link>
				</div>
			</div>
			<div class="flex flex-col gap-4 h-full overflow-y-auto">
				<slot :user="user!" :extras="extras" />
			</div>
		</template>

		<template v-slot:right-session>
			<div class="w-full shadow-custom bg-white rounded-2xl flex flex-col gap-4 p-6">
				<SofaHeaderText class="!text-lg !font-bold" content="Start something" />

				<div class="grid grid-cols-2 gap-y-2 gap-x-4">
					<SofaBadge v-for="command in rightCommands" :key="command.label" color="gray" :isInverted="true" as="a"
						class="!py-3 !px-4 truncate" @click="command.action">
						{{ command.label }}
					</SofaBadge>
				</div>
			</div>
		</template>
	</dashboard-layout>
	<SofaModal v-if="addModalType">
		<div class="flex flex-col p-4 gap-4 md:p-6 md:gap-6 justify-between">
			<div class="flex gap-2 justify-between items-center">
				<SofaHeaderText :content="addModalType === MemberTypes.teacher ? 'Add teachers' : 'Add students'" />
				<SofaIcon class="h-[19px]" name="circle-close" @click="addModalType = null" />
			</div>
			<div v-if="addModalType === MemberTypes.student"
				class="bg-primaryPurple text-white flex items-center gap-2 p-4 rounded-custom">
				<SofaIcon class="h-[16px] fill-current" name="info" />
				<SofaNormalText color="text-inherit"
					content="Students added get your classes, courses, and quizzes for FREE" />
				<SofaIcon class="h-[16px] fill-current ml-auto" name="circle-close" />
			</div>
			<div class="flex gap-2 items-center">
				<SofaTextField customClass="!bg-lightGray" v-model="addMembersEmails" padding="p-4" name="Emails"
					placeholder="Email, comma seperated" borderColor="border-transparent" />
				<SofaButton customClass="font-semibold" padding="py-3 px-6" bgColor="bg-primaryBlue" textColor="text-white"
					@click="addMembers(addModalType).then((succeeded) => succeeded ? addModalType = null : null)">
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
import { useAuth } from '@/composables/auth/auth'
import { useManageOrganizationMembers } from '@/composables/organizations/members'
import { MemberTypes } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import {
	SofaAvatar, SofaBadge,
	SofaButton,
	SofaHeaderText, SofaIcon,
	SofaModal2 as SofaModal,
	SofaNormalText,
	SofaTextField
} from 'sofa-ui-components'
import { computed, defineProps, ref } from 'vue'
import { useMeta } from 'vue-meta'

const props = defineProps({
	title: {
		type: String,
		required: true
	},
	index: {
		type: Boolean,
		required: false,
		default: false
	}
})

useMeta(computed(() => ({
	title: props.title
})))

const rightCommands = [
	{ label: 'Add a student', action: () => extras.value.openAddModal(MemberTypes.student) },
	{ label: 'Add a teacher', action: () => extras.value.openAddModal(MemberTypes.teacher) },
	{ label: 'Create a quiz', action: () => Logic.Common.GoToRoute('/quiz/create') },
	{ label: 'Create a course', action: () => Logic.Common.GoToRoute('/course/create') },
	//{ label: 'Create a class', action: () => Logic.Common.GoToRoute('/organzation/classes/create') },
]

const { id, user } = useAuth()
const { addMembersEmails, addMembers, removeMember, acceptMember } = useManageOrganizationMembers(id.value)

const options = [
	{ title: 'Dashboard', icon: 'dashboard', route: '/organization/dashboard' },
	//{ title: 'Classes', icon: 'classes', route: '/organization/classes' },
	{ title: 'Teachers', icon: 'tutor', route: '/organization/teachers' },
	{ title: 'Students', icon: 'user-unfilled', route: '/organization/students' },
]

const addModalType = ref<MemberTypes | null>(null)

const extras = computed(() => ({
	isAdmin: user.value?.id === id.value,
	openAddModal: (type: MemberTypes) => addModalType.value = type,
	removeMember, acceptMember
}))

const shareUrl = `${window.location.origin}/profile/${id.value}`
const share = async () => await Logic.Common.share('Join organization', `Join to become a member of ${user.value?.orgName}`, shareUrl)
const copy = () => Logic.Common.copy(shareUrl)
</script>
