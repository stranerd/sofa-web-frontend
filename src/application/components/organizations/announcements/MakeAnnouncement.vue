<template>
	<div class="p-4 flex flex-col gap-4">
		<div class="flex w-full items-center gap-2 justify-between mdlg:justify-center">
			<SofaHeaderText class="!font-bold !text-deepGray" content="Make an announcement" />
			<SofaIcon class="!block mdlg:!hidden h-[16px]" name="circle-close" @click="close" />
		</div>
		<form class="flex flex-col gap-8" @submit.prevent="makeAnnouncement">
			<SofaTextarea
				v-model="factory.body"
				textAreaStyle="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none"
				:error="factory.errors.body"
				placeholder="Write announcemnt" />
			<div class="grid grid-cols-2">
				<SofaSelect
					v-model="factory.lessonId"
					customClass="rounded-custom !bg-lightGray col-span-1"
					placeholder="Select lesson"
					borderColor="border-transparent"
					:error="factory.errors.lessonId"
					:options="lessonOptions" />
				<SofaSelect
					v-model="factory.userType"
					customClass="rounded-custom !bg-lightGray col-span-1"
					placeholder="Select audience"
					borderColor="border-transparent"
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
import { useMakeAnnouncement } from '@app/composables/organizations/announcements'
import { computed } from 'vue'
import { ClassEntity } from '@modules/organizations'
const props = defineProps<{
	organizationId: string
	userId: string
	classObj: ClassEntity
	close: () => void
}>()

const { factory, makeAnnouncement } = useMakeAnnouncement(props.organizationId, props.classObj.id)

const lessonOptions = computed(() => {
	// For teachers, return only lessons where user is a teacher
	if (props.classObj.isTeacher(props.userId)) {
		const lessons = props.classObj.lessons.filter((lesson) => lesson.users.teachers.includes(props.userId))
		if (lessons.length > 0) {
			return lessons.map((l) => {
				return { key: l.id, value: l.title }
			})
		} else {
			return []
		}
	}
	// For admins, return every lessons plus all students
	if (props.classObj.isAdmin(props.userId)) {
		const lessons = props.classObj.lessons
		if (lessons.length > 0) {
			const options = lessons.map((l) => {
				return { key: l.id || null, value: l.title }
			})
			options.unshift({ key: null, value: 'All lessons' })
			return options
		} else {
			return [{ key: null, value: 'All lessons' }]
		}
	}
	return []
})

const userTypesOption = computed(() => {
	// For teachers return only student
	if (props.classObj.isTeacher(props.userId)) {
		return [{ key: 'student', value: 'Students Only' }]
	}
	// For admins, return all user types
	if (props.classObj.isAdmin(props.userId)) {
		return [
			{ key: null, value: 'Both Teachers and Students' },
			{ key: 'student', value: 'Students Only' },
			{ key: 'teacher', value: 'Teachers Only' },
		]
	}
	return []
})
</script>
