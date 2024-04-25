<template>
	<div class="flex flex-col p-4 gap-4 md:p-6 md:gap-6 justify-between">
		<div class="flex gap-2 justify-between items-center">
			<SofaHeading :content="type === MemberTypes.teacher ? 'Add teachers' : 'Add students'" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>
		<div v-if="type === MemberTypes.student && showInfo" class="flex border border-primaryBlue items-center gap-2 p-4 rounded-custom">
			<SofaText content="Students added get access to your classes, courses, and quizzes for FREE" />
			<SofaIcon class="h-[16px] fill-current ml-auto" name="circle-close" @click="showInfo = false" />
		</div>
		<div class="flex gap-2 items-center">
			<SofaInput v-model="addMembersEmails" class="bg-lightGray" name="Emails" placeholder="Email, comma seperated" />
			<SofaButton class="font-semibold" padding="py-3 px-6" bgColor="bg-primaryBlue" textColor="text-white" @click="addMembers(type)">
				Invite
			</SofaButton>
		</div>
		<div class="bg-darkLightGray h-[1px] w-full" />
		<div class="flex gap-4 justify-between items-center">
			<a class="text-primaryBlue flex items-center gap-1" @click="copy">
				<SofaIcon class="w-[16px] fill-current" name="copy" />
				<SofaText content="Copy link" />
			</a>
			<a class="text-primaryBlue flex items-center gap-1" @click="share">
				<SofaIcon class="w-[16px] fill-current" name="share" />
				<SofaText content="Share link" />
			</a>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useManageOrganizationMembers } from '@app/composables/organizations/members'
import { MemberTypes } from '@modules/organizations'
import { UserEntity } from '@modules/users'

const props = defineProps<{
	org: UserEntity
	type: MemberTypes
	close: () => void
}>()

const { addMembersEmails, addMembers } = useManageOrganizationMembers(props.org.id)
const share = async () =>
	await $utils.share('Join organization', `Join to become a member of ${props.org?.publicName}`, props.org.shareLink)
const copy = () => $utils.copy(props.org.shareLink)

const showInfo = ref(true)
</script>
