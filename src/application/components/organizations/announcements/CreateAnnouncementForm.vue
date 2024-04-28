<template>
	<form class="p-4 flex flex-col gap-4" @submit.prevent="createAnnouncement">
		<div class="flex items-center gap-4">
			<SofaAvatar v-if="!classInst.isAdmin(user!)" :photoUrl="classInst.picture" :size="48" />
			<SofaTextarea
				v-model="factory.body"
				:rows="classInst.isAdmin(user!) ? 2 : 1"
				:error="factory.errors.body"
				placeholder="Announce something" />
		</div>
		<div class="flex flex-col mdlg:flex-row items-center justify-between gap-4">
			<div class="flex items-center gap-4">
				<SofaSelect
					v-model="factory.lessonIds"
					class="mdlg:w-[180px]"
					placeholder="Select lesson"
					multiple
					selectFirstOnMount
					:error="factory.errors.lessonIds"
					:options="lessonOptions" />
				<SofaSelect
					v-model="factory.userTypes"
					class="mdlg:w-[180px]"
					placeholder="Select audience"
					multiple
					selectFirstOnMount
					:error="factory.errors.userTypes"
					:options="userTypesOption" />
			</div>
			<SofaButton
				:disabled="!factory.valid"
				bgColor="bg-primaryBlue"
				type="submit"
				textColor="text-white"
				padding="py-3 px-6"
				class="w-auto ml-auto !rounded-xl">
				Post
			</SofaButton>
		</div>
	</form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useCreateAnnouncement } from '@app/composables/organizations/announcements'
import { ClassEntity, MemberTypes } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
}>()

const { user } = useAuth()
const { factory, createAnnouncement } = useCreateAnnouncement(props.classInst.organizationId, props.classInst.id)

const lessonOptions = computed(() => {
	if (!user.value) return []
	if (props.classInst.isAdmin(user.value)) {
		const lessons = props.classInst.lessons
		return [{ key: null as string | null, value: 'All' }].concat(lessons.map((l) => ({ key: l.id, value: l.title })))
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
			{ key: null, value: 'All' },
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
