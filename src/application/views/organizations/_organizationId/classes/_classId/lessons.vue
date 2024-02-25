<template>
	<ClassLayout>
		<template v-if="user" #default="{ classInst }">
			<LessonsForAdmin v-if="classInst.isAdmin(user)" :classInst="classInst" />
			<LessonsForTeachers v-if="classInst.isTeacher(user)" :classInst="classInst" />
			<LessonsForStudents v-if="classInst.isStudent(user)" :classInst="classInst" />
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
		const { user } = useAuth()
		return { user }
	},
})
</script>
