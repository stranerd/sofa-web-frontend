<template>
	<ClassLayout>
		<template #default="{ classInst }">
			<!-- <LessonsForAdmin v-if="classInst.isAdmin(userId)" :classInst="classInst" :teachers="teachers" />
			<LessonsForTeachers v-if="classInst.isTeacher(userId)" :teachers="teachers" :classInst="classInst" /> -->
			<LessonsForStudents :teachers="teachers" :classInst="classInst" />
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { useAuth } from '@app/composables/auth/auth'
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
