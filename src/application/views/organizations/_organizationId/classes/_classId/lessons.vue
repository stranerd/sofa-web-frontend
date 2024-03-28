<template>
	<ClassLayout>
		<template #default="{ classInst, user }">
			<LessonsForAdmin v-if="classInst.isAdmin(user)" :classInst="classInst" />
			<LessonsForTeachers v-if="classInst.isTeacher(user)" :classInst="classInst" />
			<LessonsForStudents v-if="classInst.isStudent(user)" :classInst="classInst" />
		</template>
	</ClassLayout>
</template>

<script lang="ts" setup>
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
</script>
