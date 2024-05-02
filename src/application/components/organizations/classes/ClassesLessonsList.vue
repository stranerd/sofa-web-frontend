<template>
	<div
		class="p-4 grow max-h-full overflow-y-auto flex flex-col gap-4 mdlg:gap-6 mdlg:bg-white mdlg:rounded-b-2xl mdlg:shadow-custom"
		:class="{ 'h-full': !lessons.length }">
		<EmptyState
			v-if="!lessons.length"
			image="lessons"
			:title="isStudent ? 'Choose your subjects to get started' : 'Getting started with subjects'"
			class="bg-white"
			:sub="emptyStateMessage"
			:primary="isTeacher ? undefined : { label: 'Add subject', action: isAdmin ? openCreateLessonModal : openSelectLessonModal }" />

		<LessonCard
			v-for="(lesson, index) in lessons.filter((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()))"
			:key="lesson.id"
			:classInst="classInst"
			:lesson="lesson"
			:index="index"
			class="bg-white mdlg:bg-lightGray rounded-xl" />
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { ClassEntity } from '@modules/organizations'

const props = defineProps<{ classInst: ClassEntity }>()

const searchQuery = defineModel<string>('searchQuery', { default: '' })

const { user } = useAuth()

const isStudent = computed(() => props.classInst.isStudent(user.value!))
const isTeacher = computed(() => props.classInst.isTeacher(user.value!))
const isAdmin = computed(() => props.classInst.isAdmin(user.value!))

const lessons = computed(() =>
	props.classInst.lessons.filter((lesson) => {
		if (isAdmin.value) return true
		if (isStudent.value) return lesson.users.students.includes(user.value!.id)
		if (isTeacher.value) return lesson.users.teachers.includes(user.value!.id)
		return false
	}),
)

const emptyStateMessage = computed(() => {
	if (isStudent.value) return 'Select the subjects you want to study in this class'
	return [
		'Comprehensive subject based curriculum',
		'Assign teachers to manage their specific subjects',
		'Contains live teaching sessions and study materials',
		'Students choose how many subjects to study in a class',
	]
})

const openCreateLessonModal = () => useModals().organizations.createLesson.open({ classInst: props.classInst })
const openSelectLessonModal = () => useModals().organizations.selectLesson.open({ classInst: props.classInst })
</script>
