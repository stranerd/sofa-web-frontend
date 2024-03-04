<template>
	<form class="p-4 mdlg:p-6 flex flex-col gap-4" @submit.prevent="createAnnouncement">
		<div class="flex w-full items-center gap-2 justify-between mdlg:justify-center">
			<SofaHeaderText class="!font-bold !text-deepGray" content="Make an announcement" />
			<SofaIcon class="!block mdlg:!hidden h-[16px]" name="circle-close" @click="close" />
		</div>
		<div class="flex flex-col gap-8">
			<SofaTextarea
				v-model="factory.body"
				textAreaStyle="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none"
				:error="factory.errors.body"
				placeholder="Write announcemnt" />
			<div class="grid gap-4 mdlg:gap-6 grid-cols-2">
				<SofaSelect
					v-model="factory.lessonIds"
					customClass="rounded-custom !bg-lightGray col-span-1"
					placeholder="Select lesson"
					borderColor="border-transparent"
					isMultiple
					:error="factory.errors.lessonIds"
					:options="lessonOptions" />
				<SofaSelect
					v-model="factory.userTypes"
					customClass="rounded-custom !bg-lightGray col-span-1"
					placeholder="Select audience"
					borderColor="border-transparent"
					isMultiple
					:error="factory.errors.userTypes"
					:options="userTypesOption" />
			</div>
			<div class="flex items-center justify-between">
				<SofaButton
					bgColor="bg-grayColor"
					textColor="text-white"
					padding="py-3 px-6"
					customClass="hidden mdlg:block"
					@click="close">
					Cancel
				</SofaButton>
				<SofaButton
					:disabled="!factory.valid"
					bgColor="bg-primaryBlue"
					type="submit"
					textColor="text-white"
					padding="py-3 px-6"
					customClass="w-full mdlg:w-auto">
					Post
				</SofaButton>
			</div>
		</div>
	</form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCreateAnnouncement } from '@app/composables/organizations/announcements'
import { ClassEntity, MemberTypes } from '@modules/organizations'
import { useAuth } from '@app/composables/auth/auth'
const props = defineProps<{
	organizationId: string
	classInst: ClassEntity
	close: () => void
}>()

const { user } = useAuth()
const { factory, createAnnouncement } = useCreateAnnouncement(props.organizationId, props.classInst.id)

const lessonOptions = computed(() => {
	if (!user.value) return []
	if (props.classInst.isAdmin(user.value)) {
		const lessons = props.classInst.lessons
		return [{ key: null as string | null, value: 'All lessons' }].concat(lessons.map((l) => ({ key: l.id, value: l.title })))
	}
	if (props.classInst.isTeacher(user.value)) {
		const lessons = props.classInst.lessons.filter((lesson) => lesson.users.teachers.includes(user.value!.id))
		return lessons.map((l) => ({ key: l.id, value: l.title }))
	}
	return []
})

const userTypesOption = computed(() => {
	if (!user.value) return []
	if (props.classInst.isAdmin(user.value)) {
		return [
			{ key: null, value: 'Both Teachers and Students' },
			{ key: MemberTypes.student, value: 'Students Only' },
			{ key: MemberTypes.teacher, value: 'Teachers Only' },
		]
	}
	if (props.classInst.isTeacher(user.value)) {
		return [{ key: MemberTypes.student, value: 'Students Only' }]
	}
	return []
})
</script>
