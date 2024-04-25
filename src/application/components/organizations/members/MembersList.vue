<template>
	<div class="p-4 mdlg:bg-white mdlg:rounded-b-2xl mdlg:shadow-custom">
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
		<div v-else class="w-full flex flex-col gap-4 md:gap-6 py-4 md:py-6">
			<div class="flex gap-4 items-center px-4 md:px-6">
				<div class="flex items-center border border-darkLightGray rounded-custom pl-4 md:min-w-[300px]">
					<SofaIcon name="search" class="h-[16px]" />
					<SofaTextField v-model="searchValue" class="w-full" placeholder="Search" type="search" borderColor="!border-none" />
				</div>
				<SofaButton
					class="ml-auto"
					customClass="font-semibold"
					padding="py-3 px-6"
					bgColor="bg-primaryBlue"
					textColor="text-white"
					@click="add">
					Add {{ isStudent ? 'student' : 'teacher' }}
				</SofaButton>
			</div>
			<div class="w-full bg-darkLightGray h-[1px]" />
			<div class="flex flex-col gap-4 md:gap-6">
				<SofaNormalText
					v-if="!pending.length && !nonPending.length"
					color="text-inherit"
					content="No member matches the search query" />
				<template v-for="member in [...pending, ...nonPending]" :key="member.id">
					<div class="flex gap-2 items-center w-full px-4 md:px-6">
						<SofaAvatar :photoUrl="member.user?.bio.photo?.link" :size="28" />
						<SofaNormalText
							color="text-inherit"
							:content="`${member.user?.bio.publicName ?? member.email}${member.pending ? ' sent a request' : ''}`"
							class="truncate grow" />
						<template v-if="member.pending">
							<SofaNormalText as="a" color="text-primaryRed" content="Decline" @click="acceptMember(member, false)" />
							<div class="h-full bg-darkLightGray w-[1px]" />
							<SofaNormalText as="a" color="text-primaryGreen" content="Accept" @click="acceptMember(member, true)" />
						</template>
						<SofaNormalText v-else as="a" color="text-primaryRed" content="Remove" @click="removeMember(member)" />
					</div>
					<div v-if="nonPending.at(-1)?.id !== member.id" class="w-full bg-darkLightGray h-[1px]" />
				</template>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useModals } from '@app/composables/core/modals'
import { useManageOrganizationMembers } from '@app/composables/organizations/members'
import { MemberEntity, MemberTypes } from '@modules/organizations'
import { UserEntity } from '@modules/users'

const props = defineProps<{
	type: MemberTypes
	members: MemberEntity[]
	org: UserEntity
}>()

const { removeMember, acceptMember } = useManageOrganizationMembers(props.org.id)
const add = () => useModals().organizations.addMember.open({ org: props.org, type: props.type })

const isStudent = computed(() => props.type === MemberTypes.student)

const searchValue = ref('')

const pending = computed(() => props.members.filter((m) => m.pending && m.search(searchValue.value)))
const nonPending = computed(() => props.members.filter((m) => !m.pending && m.search(searchValue.value)))
</script>
