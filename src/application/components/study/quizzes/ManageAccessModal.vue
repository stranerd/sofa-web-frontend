<template>
	<div class="flex flex-col gap-6 p-4 md:p-8">
		<div class="w-full flex items-center gap-4 justify-between text-deepGray">
			<SofaHeading size="title" content="Invite" />
			<SofaIcon name="circle-close" class="rounded-full h-[32px] fill-current cursor-pointer" @click="close" />
		</div>

		<div class="flex gap-4 items-center">
			<SofaTextField
				v-model="searchValue"
				customClass="rounded-custom !bg-lightGray"
				name="Emails"
				placeholder="Email, comma seperated"
				borderColor="border-transparent" />
			<SofaButton padding="py-3 px-6" bgColor="bg-primaryBlue" textColor="text-white" @click="addUsers"> Add </SofaButton>
		</div>

		<template v-if="requests.length">
			<div class="bg-darkLightGray h-[1px] w-full" />

			<div class="w-full flex flex-col gap-2">
				<div v-for="request in requests" :key="request.id" class="flex gap-2 items-center w-full">
					<SofaAvatar :photoUrl="request.bio.photo?.link" :size="28" />
					<SofaText :content="`${request.publicName} wants to edit`" clamp class="text-deepGray grow" />
					<SofaText as="a" class="text-primaryRed" content="Deny" @click="grantAccess(request.id, false)" />
					<div class="h-full bg-darkLightGray w-[1px]" />
					<SofaText as="a" class="text-primaryGreen" content="Approve" @click="grantAccess(request.id, true)" />
				</div>
			</div>
		</template>

		<div class="bg-darkLightGray h-[1px] w-full" />

		<div class="w-full flex flex-col gap-2">
			<div v-for="member in members" :key="member.id" class="flex gap-2 items-center w-full">
				<SofaAvatar :photoUrl="member.bio.photo?.link" :size="28" />
				<SofaText :content="member.publicName" clamp class="text-deepGray grow" />
				<template v-if="member.id !== quiz.user.id">
					<SofaText as="a" class="text-primaryRed" content="Remove" @click="manageMembers([member.id], false)" />
					<div class="h-full bg-darkLightGray w-[1px]" />
				</template>
				<SofaText :content="member.id === quiz.user.id ? 'Owner' : 'Editor'" />
			</div>
		</div>

		<div class="bg-darkLightGray h-[1px] w-full" />

		<div class="flex gap-4 justify-between items-center">
			<a class="text-primaryBlue flex items-center gap-1" @click="share">
				<SofaIcon class="w-[16px] fill-current" name="share" />
				<SofaText content="Share" />
			</a>
			<a class="text-primaryBlue flex items-center gap-1" @click="copy">
				<SofaIcon class="w-[16px] fill-current" name="copy" />
				<SofaText content="Copy" />
			</a>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useSearchUsersByEmail } from '@app/composables/users/users'
import { QuizEntity } from '@modules/study'
import { UserEntity } from '@modules/users'

const props = defineProps<{
	close: () => void
	quiz: QuizEntity
	users: UserEntity[]
	grantAccess: (userId: string, grant: boolean) => Promise<void>
	manageMembers: (userIds: string[], grant: boolean) => Promise<void>
}>()

const { searchUsersByEmails, searchValue } = useSearchUsersByEmail()

const addUsers = async () => {
	const users = await searchUsersByEmails(searchValue.value)
	if (users?.length)
		props.manageMembers(
			users.map((u) => u.id),
			true,
		)
}

const members = computed(() => props.users.filter((u) => [props.quiz.user.id, ...props.quiz.access.members].includes(u.id)))
const requests = computed(() => props.users.filter((u) => props.quiz.access.requests.includes(u.id)))

const shareUrl = props.quiz.accessShareLink
const share = async () => await $utils.share('Edit quiz', `Gain access to edit quiz: ${props.quiz.title}`, shareUrl)
const copy = () => $utils.copy(shareUrl)
</script>
