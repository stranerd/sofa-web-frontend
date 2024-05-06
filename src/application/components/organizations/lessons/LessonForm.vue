<template>
	<div class="p-4 mdlg:p-6 flex flex-col gap-4 h-full">
		<div class="flex w-full items-center gap-2 justify-between">
			<SofaIcon v-if="stage > 1" class="h-[15px]" name="arrow-left" @click="stage--" />
			<SofaHeading size="title" :content="title" />
			<SofaIcon v-if="!$screen.desktop" class="h-[16px]" name="circle-close" @click="cancel" />
			<span v-else class="w-4" />
		</div>
		<div class="flex h-[6px] gap-1 mb-4">
			<div v-for="i in 2" :key="i" class="rounded-full flex-1 h-full" :class="i <= stage ? 'bg-primaryPurple' : 'bg-darkLightGray'" />
		</div>
		<div class="flex flex-col gap-4 grow overflow-y-auto">
			<template v-if="stage === 1">
				<SofaFormGroup>
					<SofaLabel>Subject Title</SofaLabel>
					<SofaInput v-model="factory.title" type="text" placeholder="Enter subject title" :error="factory.errors.title" />
				</SofaFormGroup>
			</template>
			<template v-if="stage === 2">
				<div class="flex items-center justify-between gap-2">
					<SofaHeading content="Assign teachers" size="mid" />
					<SofaText as="a" class="flex items-center gap-2 text-primaryPurple" @click="addTeacher">
						<span>Add new</span>
						<SofaIcon class="h-[16px] fill-current" name="add" />
					</SofaText>
				</div>
				<EmptyState
					v-if="!teachers.length"
					image="teachers"
					title="You have no teachers"
					class="bg-lightGray"
					sub="Add teachers to your organization"
					:primary="{ label: 'Add teacher', action: addTeacher }" />
				<div class="flex flex-col border border-lightGray">
					<SofaCheckbox
						v-for="(member, index) in teachers"
						:key="member.hash"
						v-model="factory.teachers"
						rotate
						:value="member.user!.id"
						:class="{ 'bg-lightGray': index % 2 === 0 }"
						class="p-4">
						<UserName :user="member.user!" />
					</SofaCheckbox>
				</div>
				<SofaText v-if="factory.errors.teachers" :content="factory.errors.teachers" size="sub" class="text-primaryRed" />
			</template>
		</div>

		<div class="flex items-center justify-between">
			<SofaButton bgColor="bg-grayColor" textColor="text-white" padding="py-3 px-6" class="hidden mdlg:block" @click="cancel">
				Cancel
			</SofaButton>
			<SofaButton
				bgColor="bg-primaryBlue"
				textColor="text-white"
				padding="py-3 px-6"
				:disabled="isDisabled"
				class="w-full mdlg:w-auto"
				@click="nextHandler">
				{{ nextButtonLabel }}
			</SofaButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useModals } from '@app/composables/core/modals'
import { useOrganizationMembers } from '@app/composables/organizations/members'
import { useUsersInList } from '@app/composables/users/users'
import { ClassEntity, LessonFactory, MemberTypes } from '@modules/organizations'

const props = withDefaults(
	defineProps<{
		title: string
		classInst: ClassEntity
		factory: LessonFactory
		initialStage?: 1 | 2
		cancel: () => void
		submit: () => void
	}>(),
	{ initialStage: 1 },
)

const stage = ref(props.initialStage)

const orgId = computed(() => [props.classInst.organizationId])
const { users } = useUsersInList(orgId)
const org = computed(() => users.value.at(0) ?? null)
const { teachers: orgTeachers } = useOrganizationMembers(props.classInst.organizationId)
const teachers = computed(() => orgTeachers.value.filter((t) => !!t.user))

const isDisabled = computed(() => {
	if (stage.value === 1) return !props.factory.isValid('title')
	if (stage.value === 2) return !props.factory.valid
	return true
})

const nextHandler = async () => {
	if (stage.value === 1) return stage.value++
	if (stage.value === 2) return props.submit()
}
const nextButtonLabel = computed(() => {
	if (stage.value === 1) return 'Next'
	if (stage.value === 2) return 'Done'
	return ''
})

const addTeacher = () => {
	if (!org.value) return
	useModals().organizations.addMember.open({ org: org.value, type: MemberTypes.teacher })
}
</script>
