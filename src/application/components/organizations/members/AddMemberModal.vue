<template>
	<div class="flex flex-col p-4 gap-4 md:p-6 md:gap-6 justify-between">
		<div class="flex gap-2 justify-between items-center">
			<SofaHeaderText :content="type === MemberTypes.teacher ? 'Add teachers' : 'Add students'" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>
		<div v-if="type === MemberTypes.student" class="bg-primaryPurple text-white flex items-center gap-2 p-4 rounded-custom">
			<SofaIcon class="h-[16px] fill-current" name="info" />
			<SofaNormalText color="text-inherit" content="Students added get your classes, courses, and quizzes for FREE" />
			<SofaIcon class="h-[16px] fill-current ml-auto" name="circle-close" />
		</div>
		<div class="flex gap-2 items-center">
			<SofaTextField
				v-model="addMembersEmails"
				custom-class="!bg-lightGray"
				name="Emails"
				placeholder="Email, comma seperated"
				border-color="border-transparent" />
			<SofaButton
				custom-class="font-semibold"
				padding="py-3 px-6"
				bg-color="bg-primaryBlue"
				text-color="text-white"
				@click="addMembers(type)">
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
</template>

<script lang="ts" setup>
import { useManageOrganizationMembers } from '@app/composables/organizations/members'
import { MemberTypes } from '@modules/organizations'
import { UserEntity } from '@modules/users'
import { Logic } from 'sofa-logic'

const props = defineProps<{
	org: UserEntity
	type: MemberTypes
	close: () => void
}>()

const { addMembersEmails, addMembers } = useManageOrganizationMembers(props.org.id)
const share = async () =>
	await Logic.Common.share('Join organization', `Join to become a member of ${props.org?.orgName}`, props.org.shareLink)
const copy = () => Logic.Common.copy(props.org.shareLink)
</script>
