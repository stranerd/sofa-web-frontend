<template>
	<div class="p-4 mdlg:p-6 flex flex-col gap-4">
		<div class="flex w-full items-center gap-2 justify-between mdlg:justify-center">
			<SofaHeaderText class="!font-bold !text-deepGray" content="Make an announcement" />
			<SofaIcon class="!block mdlg:!hidden h-[16px]" name="circle-close" @click="close" />
		</div>
		<form class="flex flex-col gap-8" @submit.prevent="createAnnouncement">
			<SofaTextarea
				v-model="factory.body"
				textAreaStyle="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none"
				:error="factory.errors.body"
				placeholder="Write announcemnt" />
			<div class="grid gap-4 mdlg:gap-6 grid-cols-2">
				<SofaSelect
					v-model="factory.lessonId"
					customClass="rounded-custom !bg-lightGray col-span-1"
					placeholder="Select lesson"
					borderColor="border-transparent"
					selectFirstOnMount
					:error="factory.errors.lessonId"
					:options="lessonOptions" />
				<SofaSelect
					v-model="factory.userType"
					customClass="rounded-custom !bg-lightGray col-span-1"
					placeholder="Select audience"
					borderColor="border-transparent"
					selectFirstOnMount
					:error="factory.errors.userType"
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
					bgColor="bg-primaryBlue"
					type="submit"
					textColor="text-white"
					padding="py-3 px-6"
					customClass="w-full mdlg:w-auto">
					Post
				</SofaButton>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { useCreateAnnouncement } from '@app/composables/organizations/announcements'
import { ClassEntity, MemberTypes } from '@modules/organizations'
import { computed } from 'vue'
const props = defineProps<{
	organizationId: string
	userId: string
	classInst: ClassEntity
	close: () => void
}>()

const { factory, createAnnouncement } = useCreateAnnouncement(props.organizationId, props.classInst.id)

const lessonOptions = computed(() => {
	// For teachers, return only lessons where user is a teacher
	if (props.classInst.isTeacher(props.userId)) {
		const lessons = props.classInst.lessons.filter((lesson) => lesson.users.teachers.includes(props.userId))
		return lessons.map((l) => ({ key: l.id, value: l.title }))
	}
	// For admins, return every lessons plus all students
	if (props.classInst.isAdmin(props.userId)) {
		const lessons = props.classInst.lessons
		return [{ key: null as string | null, value: 'All lessons' }].concat(lessons.map((l) => ({ key: l.id, value: l.title })))
	}
	return []
})

const userTypesOption = computed(() => {
	// For teachers return only student
	if (props.classInst.isTeacher(props.userId)) {
		return [{ key: MemberTypes.student, value: 'Students Only' }]
	}
	// For admins, return all user types
	if (props.classInst.isAdmin(props.userId)) {
		return [
			{ key: null, value: 'Both Teachers and Students' },
			{ key: MemberTypes.student, value: 'Students Only' },
			{ key: MemberTypes.teacher, value: 'Teachers Only' },
		]
	}
	return []
})
</script>
