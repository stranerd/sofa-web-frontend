<template>
	<ClassLayout v-model="classInst" title="Subjects" :primary="showPrimary ? { label: 'Add subject', action: handlePrimary } : undefined">
		<template #default="{ classInst, extras }">
			<div
				class="p-4 grow max-h-full overflow-y-auto flex flex-col gap-4 mdlg:bg-white mdlg:rounded-b-2xl mdlg:shadow-custom"
				:class="{ 'h-full': !lessons.length }">
				<EmptyState
					v-if="!lessons.length"
					image="lessons"
					:title="isStudent ? 'Choose your subjects to get started' : 'Getting started with subjects'"
					class="bg-white"
					:sub="emptyStateMessage"
					:primary="isAdmin || isStudent ? { label: 'Add subject', action: handlePrimary } : undefined" />

				<template v-else>
					<div v-if="!$screen.desktop" class="flex items-center gap-2">
						<SofaInput v-model="extras.searchQuery" placeholder="Search" type="search" class="!bg-white mdlg:!p-3 grow">
							<template #prefix>
								<SofaIcon name="search" class="h-[16px]" />
							</template>
						</SofaInput>
						<SofaButton
							v-if="isAdmin || isStudent"
							bgColor="bg-primaryBlue"
							textColor="text-white"
							padding="px-5 py-3"
							@click="handlePrimary">
							Add Subject
						</SofaButton>
					</div>
					<LessonCard
						v-for="(lesson, index) in lessons.filter((l) => l.title.toLowerCase().includes(extras.searchQuery.toLowerCase()))"
						:key="lesson.id"
						:classInst="classInst"
						:lesson="lesson"
						:index="index"
						as="router-link"
						:to="`${classInst.pageLink}/subjects/${lesson.id}`"
						class="bg-white mdlg:bg-lightGray rounded-xl" />
				</template>
			</div>
		</template>
	</ClassLayout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { ClassEntity } from '@modules/organizations'

const { user } = useAuth()
const classInst = ref<ClassEntity | null>(null)

const isStudent = computed(() => classInst.value?.isStudent(user.value!))
const isTeacher = computed(() => classInst.value?.isTeacher(user.value!))
const isAdmin = computed(() => classInst.value?.isAdmin(user.value!))

const lessons = computed(
	() =>
		classInst.value?.lessons.filter((lesson) => {
			if (isAdmin.value) return true
			if (isTeacher.value && lesson.users.teachers.includes(user.value!.id)) return true
			if (isStudent.value && lesson.users.students.includes(user.value!.id)) return true
			return false
		}) ?? [],
)

const showPrimary = computed(() => {
	if (!classInst.value || !user.value) return false
	return classInst.value.isStudent(user.value) || classInst.value.isAdmin(user.value)
})

const emptyStateMessage = computed(() => {
	if (isStudent.value) return 'Select the subjects you want to study in this class'
	return [
		'Comprehensive subject based curriculum',
		'Assign teachers to manage their specific subjects',
		'Contains live teaching sessions and study materials',
		'Students choose how many subjects to study in a class',
	]
})

const handlePrimary = () => {
	if (!classInst.value || !user.value) return
	if (classInst.value.isAdmin(user.value)) return useModals().organizations.createLesson.open({ classInst: classInst.value })
	if (classInst.value.isStudent(user.value)) return useModals().organizations.selectLesson.open({ classInst: classInst.value })
}
</script>
