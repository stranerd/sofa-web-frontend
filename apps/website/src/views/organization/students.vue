<template>
	<OrganizationLayout title="Students">
		<template v-slot="{ extras }">
			<div v-if="!pending.length && !nonPending.length"
				class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col mdlg:flex-row gap-4 p-6">
				<div class="h-full aspect-square bg-lightGrayVaraint rounded flex items-center justify-center">
					<img class="w-3/4 h-3/4" src="@/assets/images/class-students.png" />
				</div>
				<div class="flex flex-col gap-2">
					<SofaHeaderText color="text-inherit" size="xl" content="Getting started with teachers" />
					<div v-for="message in messages" :key="message" class="flex gap-2 items-center">
						<SofaIcon name="checkmark-circle" class="w-[16px] h-[16px]" />
						<SofaNormalText color="text-grayColor" :content="message" />
					</div>
					<SofaButton bgColor="bg-primaryBlue" textColor="text-white" class="self-start mt-2" padding="px-6 py-4"
						@click="extras.openAddModal(MemberTypes.student)">
						Add students
					</SofaButton>
				</div>
			</div>
			<div v-else class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 md:p-6">
				<div class="flex gap-4 items-center">
					<SofaTextField class="!w-auto" customClass="!bg-lightGrayVaraint"
						padding="p-4" placeholder="Search" type="search"
						borderColor="border-transparent" />
					<SofaButton class="ml-auto"
						customClass="w-full font-semibold" padding="py-4 px-6" bgColor="bg-primaryBlue"
						textColor="text-white" @click="extras.openAddModal(MemberTypes.student)">
						Add students
					</SofaButton>
				</div>
				<div class="w-full bg-darkLightGray h-[1px]" />
				<template v-for="member in [...pending, ...nonPending]" :key="member.id">
					<div class="flex gap-2 items-center w-full">
						<SofaAvatar :photoUrl="member.user?.bio.photo?.link" size="28" />
						<SofaNormalText color="text-inherit"
							:content="`${member.user?.bio.name.full ?? member.email}${member.pending ? ' wants to edit' : ''}`"
							class="truncate flex-grow" />
						<template v-if="member.pending">
							<SofaNormalText as="a" color="text-primaryRed" content="Decline"
								@click="extras.acceptMember(member, false)" />
							<div class="h-full bg-darkLightGray w-[1px]" />
							<SofaNormalText as="a" color="text-primaryGreen" content="Accept"
								@click="extras.acceptMember(member, true)" />
						</template>
						<SofaNormalText v-else as="a" color="text-primaryRed" content="Remove"
							@click="extras.removeMember(member)" />
					</div>
					<div v-if="nonPending.at(-1)?.id !== member.id" class="w-full bg-darkLightGray h-[1px]" />
				</template>
			</div>
		</template>
	</OrganizationLayout>
</template>

<script lang="ts">
import OrganizationLayout from "@/components/users/organizations/OrganizationLayout.vue"
import { useAuth } from '@/composables/auth/auth'
import { useOrganizationMembers } from '@/composables/organizations/members'
import { generateMiddlewares } from '@/middlewares'
import { MemberTypes } from "@modules/organizations"
import { Logic } from 'sofa-logic'
import { SofaAvatar, SofaButton, SofaHeaderText, SofaIcon, SofaNormalText, SofaTextField } from 'sofa-ui-components/src'
import { computed, defineComponent } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
	components: {
		OrganizationLayout, SofaHeaderText, SofaNormalText, SofaIcon, SofaButton,
		SofaAvatar, SofaTextField
	},
	name: "OrganizationStudentsPage",
	middlewares: { goBackRoute: '/organization' },
	beforeRouteEnter: generateMiddlewares(['isOrg']),
	setup () {
		useMeta({
			title: "Students",
		})

		const messages = [
			'Add students from your physical class here.',
			'Students here get your classes, courses, and quizzes for FREE.',
			'Your students can revisit live classes for revision purposes.',
			'No loss of study resources so students can keep coming back to them.'
		]

		const { id } = useAuth()
		const { students } = useOrganizationMembers(id.value)
		const pending = computed(() => students.value.filter(m => m.pending))
		const nonPending = computed(() => students.value.filter(m => !m.pending))
		return { pending, nonPending, Logic, messages, MemberTypes }
	},
})
</script>
