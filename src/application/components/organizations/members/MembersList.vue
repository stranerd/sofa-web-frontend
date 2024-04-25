<template>
	<div class="p-4 flex flex-col gap-4 mdlg:gap-6 mdlg:bg-white mdlg:rounded-b-2xl mdlg:shadow-custom">
		<EmptyState
			v-if="!members.length"
			:image="isStudent ? 'students' : 'teachers'"
			:title="isStudent ? 'You have no students' : 'You have no teachers'"
			class="bg-white"
			:sub="
				isStudent
					? 'Add your offline students to your organization so they can access to your classes, courses, and quizzes'
					: 'Add teachers to your organization'
			"
			:primary="{ label: isStudent ? 'Add student' : 'Add teacher', action: add }" />
		<div v-if="pending.length" class="flex flex-col rounded-2xl border border-lightGray bg-white text-deepGray px-0.5 mdlg:px-0">
			<SofaText :content="`Requests (${$utils.formatNumber(pending.length)})`" class="p-4" />
			<div
				v-for="(member, index) in pending"
				:key="member.hash"
				class="flex gap-3 items-center w-full p-3 mdlg:p-4"
				:class="{ 'bg-lightGray': index % 2 === 0 }">
				<SofaAvatar :photoUrl="member.user?.bio.photo?.link" :size="$screen.desktop ? 48 : 32" />
				<SofaText
					:content="`${member.user?.bio.publicName ?? member.email}${member.pending ? ' sent a request' : ''}`"
					class="truncate grow" />
				<template v-if="member.pending">
					<SofaText as="a" class="text-primaryRed" content="Decline" size="sub" @click="acceptMember(member, false)" />
					<div class="h-full bg-darkLightGray w-[1px]" />
					<SofaText as="a" class="text-primaryGreen" content="Accept" size="sub" @click="acceptMember(member, true)" />
				</template>
				<SofaText v-else as="a" class="text-primaryRed" content="Remove" size="sub" @click="removeMember(member)" />
			</div>
		</div>
		<SofaButton
			v-if="!$screen.desktop"
			bgColor="bg-primaryBlue"
			padding="py-3 px-6"
			textColor="text-white"
			class="border border-primaryBlue"
			@click="add">
			{{ isStudent ? 'Add student' : 'Add teacher' }}
		</SofaButton>
		<div v-if="nonPending.length" class="flex flex-col rounded-2xl border border-lightGray bg-white text-deepGray px-1 mdlg:px-0">
			<SofaText :content="`${isStudent ? 'Students' : 'Teachers'} (${$utils.formatNumber(nonPending.length)})`" class="p-4" />
			<div
				v-for="(member, index) in nonPending"
				:key="member.hash"
				class="flex gap-3 items-center w-full p-3 mdlg:p-4"
				:class="{ 'bg-lightGray': index % 2 === 0 }">
				<SofaAvatar :photoUrl="member.user?.bio.photo?.link" :size="$screen.desktop ? 48 : 32" />
				<SofaText
					:content="`${member.user?.bio.publicName ?? member.email}${member.pending ? ' sent a request' : ''}`"
					class="truncate grow" />
				<template v-if="member.pending">
					<SofaText as="a" class="text-primaryRed" content="Decline" size="sub" @click="acceptMember(member, false)" />
					<div class="h-full bg-darkLightGray w-[1px]" />
					<SofaText as="a" class="text-primaryGreen" content="Accept" size="sub" @click="acceptMember(member, true)" />
				</template>
				<SofaText v-else as="a" class="text-primaryRed" content="Remove" size="sub" @click="removeMember(member)" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useModals } from '@app/composables/core/modals'
import { useManageOrganizationMembers } from '@app/composables/organizations/members'
import { MemberEntity, MemberTypes } from '@modules/organizations'
import { UserEntity } from '@modules/users'

const props = defineProps<{
	type: MemberTypes
	members: MemberEntity[]
	filteredMembers: MemberEntity[]
	org: UserEntity
}>()

const { removeMember, acceptMember } = useManageOrganizationMembers(props.org.id)
const add = () => useModals().organizations.addMember.open({ org: props.org, type: props.type })

const isStudent = computed(() => props.type === MemberTypes.student)

const pending = computed(() => props.filteredMembers.filter((m) => m.pending))
const nonPending = computed(() => props.filteredMembers.filter((m) => !m.pending))
</script>
