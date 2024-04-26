<template>
	<div class="p-4 flex flex-col gap-4 mdlg:gap-6 mdlg:bg-white mdlg:rounded-b-2xl mdlg:shadow-custom">
		<EmptyState
			v-if="!users.length"
			:image="isStudent ? 'students' : 'teachers'"
			:title="isStudent ? 'No students in this class' : 'No teachers in this class'"
			class="bg-white"
			:sub="isStudent ? 'Students that enroll in this class will appear here' : 'Teachers assigned to this class will appear here'" />

		<template v-else>
			<SofaInput v-if="!$screen.desktop" v-model="searchQuery" placeholder="Search" type="search" class="bg-white" padding="p-3">
				<template #prefix>
					<SofaIcon name="search" class="h-[16px]" />
				</template>
			</SofaInput>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ClassEntity } from '@modules/organizations'
import { useUsersInList } from '@app/composables/users/users'

const props = defineProps<{
	classInst: ClassEntity
	type: 'students' | 'teachers'
}>()

const searchQuery = defineModel<string>('searchQuery')

const isStudent = computed(() => props.type === 'students')
const usersIds = computed(() => (isStudent.value ? props.classInst.members.students : props.classInst.teachers))
const { users } = useUsersInList(usersIds)
</script>
