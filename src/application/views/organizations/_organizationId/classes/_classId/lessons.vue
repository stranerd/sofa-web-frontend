<template>
	<ClassLayout>
		<template #default="{ classObj }">
			<LessonsForAdmin v-if="classObj.isAdmin(userId)" :classObj="classObj" :teachers="teachers" />
			<LessonsForTeachers v-if="classObj.isTeacher(userId)" :teachers="teachers" :classObj="classObj" />
			<LessonsForStudents v-if="classObj.isStudent(userId)" :teachers="teachers" :classObj="classObj" />
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { useAuth } from '@app/composables/auth/auth'
import { defineComponent } from 'vue'
import { useOrganizationMembers } from '@app/composables/organizations/members'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdLessons',
	components: { ClassLayout },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const { id: userId } = useAuth()
		const { teachers } = useOrganizationMembers(userId.value)

		return {
			userId,
			teachers,
		}
	},
})
</script>
