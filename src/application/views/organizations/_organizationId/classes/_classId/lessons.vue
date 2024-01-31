<template>
	<ClassLayout>
		<template #default="{ classInst }">
			<LessonsForAdmin v-if="classInst.isAdmin(userId)" :classInst="classInst" />
			<LessonsForTeachers v-if="classInst.isTeacher(userId)" :classInst="classInst" />
			<LessonsForStudents v-if="classInst.isStudent(userId)" :classInst="classInst" />
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { useAuth } from '@app/composables/auth/auth'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdLessons',
	components: { ClassLayout },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const { id: userId } = useAuth()
		return { userId }
	},
})
</script>
