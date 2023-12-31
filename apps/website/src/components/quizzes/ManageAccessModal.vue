<template>
	<SofaModal>
		<div class="flex flex-col gap-6 p-4 md:p-8">
			<div class="w-full flex items-center gap-4 justify-between text-deepGray">
				<SofaHeaderText size="xl" class="!font-bold" content="Invite" />
				<SofaIcon name="close-white" class="rounded-full h-[32px] fill-current cursor-pointer" @click="emits('close')" />
			</div>

			<div class="flex gap-4 items-center">
				<SofaTextField
					v-model="searchValue"
					custom-class="rounded-custom !bg-lightGray"
					name="Emails"
					placeholder="Email, comma seperated"
					border-color="border-transparent" />
				<SofaButton
					custom-class="font-semibold"
					padding="py-3 px-6"
					bg-color="bg-primaryBlue"
					text-color="text-white"
					@click="addUsers">
					Add
				</SofaButton>
			</div>

			<template v-if="requests.length">
				<div class="bg-darkLightGray h-[1px] w-full" />

				<div class="w-full flex flex-col gap-2">
					<div v-for="request in requests" :key="request.id" class="flex gap-2 items-center w-full">
						<SofaAvatar :photo-url="request.bio.photo?.link" size="28" />
						<SofaNormalText
							color="text-deepGray"
							:content="`${request.bio.name.full} wants to edit`"
							class="truncate flex-grow" />
						<SofaNormalText as="a" color="text-primaryRed" content="Deny" @click="emits('grantAccess', request.id, false)" />
						<div class="h-full bg-darkLightGray w-[1px]" />
						<SofaNormalText
							as="a"
							color="text-primaryGreen"
							content="Approve"
							@click="emits('grantAccess', request.id, true)" />
					</div>
				</div>
			</template>

			<div class="bg-darkLightGray h-[1px] w-full" />

			<div class="w-full flex flex-col gap-2">
				<div v-for="member in [quiz.user, ...members]" :key="member.id" class="flex gap-2 items-center w-full">
					<SofaAvatar :photo-url="member.bio.photo?.link" size="28" />
					<SofaNormalText color="text-deepGray" :content="member.bio.name.full" class="truncate flex-grow" />
					<template v-if="member.id !== quiz.user.id">
						<SofaNormalText
							as="a"
							color="text-primaryRed"
							content="Remove"
							@click="emits('manageMembers', [member.id], false)" />
						<div class="h-full bg-darkLightGray w-[1px]" />
					</template>
					<SofaNormalText color="text-inherit" :content="member.id === quiz.user.id ? 'Owner' : 'Editor'" />
				</div>
			</div>

			<div class="bg-darkLightGray h-[1px] w-full" />

			<div class="flex gap-4 justify-between items-center">
				<a class="text-primaryBlue flex items-center gap-1" @click="share">
					<SofaIcon class="w-[16px] fill-current" name="share" />
					<SofaNormalText color="text-inherit" content="Share" />
				</a>
				<a class="text-primaryBlue flex items-center gap-1" @click="copy">
					<SofaIcon class="w-[16px] fill-current" name="copy" />
					<SofaNormalText color="text-inherit" content="Copy" />
				</a>
			</div>
		</div>
	</SofaModal>
</template>

<script lang="ts" setup>
import { useSearchUsers } from '@/composables/users/users'
import { QuizEntity } from '@modules/study'
import { Logic, SingleUser } from 'sofa-logic'
import {
	SofaAvatar,
	SofaButton,
	SofaHeaderText,
	SofaIcon,
	SofaModal2 as SofaModal,
	SofaNormalText,
	SofaTextField,
} from 'sofa-ui-components'
import { PropType, computed, defineEmits, defineProps } from 'vue'

const props = defineProps({
	quiz: {
		type: Object as PropType<QuizEntity>,
		required: true,
	},
	users: {
		type: Array as PropType<SingleUser[]>,
		required: true,
	},
})

const emits = defineEmits<{
	grantAccess: [userId: string, grant: boolean]
	manageMembers: [userIds: string[], grant: boolean]
	close: []
}>()

const { searchUsersByEmails, searchValue } = useSearchUsers()

const addUsers = async () => {
	const emails = searchValue.value
		.toLowerCase()
		.split(',')
		.map((e) => e.trim())
	const users = await searchUsersByEmails(emails)
	if (users.length)
		emits(
			'manageMembers',
			users.map((u) => u.id),
			true,
		)
}

const members = computed(() => props.users.filter((u) => props.quiz.access.members.includes(u.id)))
const requests = computed(() => props.users.filter((u) => props.quiz.access.requests.includes(u.id)))

const shareUrl = `${window.location.origin}/quiz/${props.quiz.id}/edit`
const share = async () => await Logic.Common.share('Edit quiz', `Gain access to edit quiz: ${props.quiz.title}`, shareUrl)
const copy = () => Logic.Common.copy(shareUrl)
</script>
