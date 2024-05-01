<template>
	<ClassLayout v-if="user" title="Lessons">
		<template #default="{ classInst }">
			<LessonsForAdmin v-if="classInst.isAdmin(user)" :classInst="classInst" />
			<LessonsForTeachers v-if="classInst.isTeacher(user)" :classInst="classInst" />
			<LessonsForStudents v-if="classInst.isStudent(user)" :classInst="classInst" />
		</template>
	</ClassLayout>
</template>

<script lang="ts" setup>
import { useAuth } from '@app/composables/auth/auth'

const { user } = useAuth()
</script>
