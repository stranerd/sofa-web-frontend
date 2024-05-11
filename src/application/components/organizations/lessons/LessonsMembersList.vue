<template>
	<div
		class="p-4 max-h-full overflow-y-auto flex flex-col gap-4 mdlg:gap-6 mdlg:bg-white mdlg:rounded-b-2xl mdlg:shadow-custom"
		:class="{ 'h-full grow': !users.length }">
		<EmptyState
			v-if="!users.length"
			:image="isStudent ? 'students' : 'teachers'"
			:title="isStudent ? 'No students studying this course' : 'No teachers assigned to this course'"
			class="bg-white"
			:sub="isStudent ? 'Students that enroll in this course will appear here' : 'Teachers assigned to this course will appear here'"
			:primary="!isStudent ? { label: 'Add teacher', action: editLesson } : undefined" />

		<template v-else>
			<SofaButton
				v-if="!isStudent && !$screen.desktop"
				bgColor="bg-primaryBlue"
				textColor="text-white"
				padding="px-6 py-3"
				@click="editLesson">
				Add teacher
			</SofaButton>
			<div class="w-full bg-white border border-lightGray p-1 mdlg:p-0 rounded-2xl">
				<UserName
					v-for="(user, i) in filteredUsers"
					:key="user.hash"
					:user="user"
					class="p-4"
					:class="{ 'bg-lightGray': i % 2 === 0 }" />
			</div>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useModals } from '@app/composables/core/modals'
import { useUsersInList } from '@app/composables/users/users'
import { ClassEntity, ClassLesson } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
	lesson: ClassLesson
	type: 'students' | 'teachers'
}>()

const searchQuery = defineModel<string>('searchQuery', { default: '' })

const isStudent = computed(() => props.type === 'students')
const usersIds = computed(() => (isStudent.value ? props.lesson.users.students : props.lesson.users.teachers))
const { users } = useUsersInList(usersIds)
const filteredUsers = computed(() => users.value.filter((u) => u.search(searchQuery.value)))

const editLesson = () => {
	useModals().organizations.editLesson.open({ classInst: props.classInst, lesson: props.lesson, initialStage: 2 })
}
</script>
