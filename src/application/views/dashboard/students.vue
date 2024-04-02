<template>
	<DashboardLayout title="Students">
		<MembersList :org="user!" :image="studentsImage" :type="MemberTypes.student" :members="students" :messages="messages" />
	</DashboardLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import studentsImage from '@app/assets/images/class-students.png'
import MembersList from '@app/components/organizations/members/MembersList.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useOrganizationMembers } from '@app/composables/organizations/members'
import { MemberTypes } from '@modules/organizations'

export default defineComponent({
	name: 'OrganizationStudentsPage',
	components: { MembersList },
	routeConfig: { goBackRoute: '/dashboard', middlewares: ['isOrg'] },
	setup() {
		useMeta({ title: 'Students' })

		const messages = [
			'Add students from your physical class here.',
			'Students here get your classes, courses, and quizzes for FREE.',
			'Your students can revisit live classes for revision purposes.',
			'No loss of study resources so students can keep coming back to them.',
		]

		const { id, user } = useAuth()
		const { students } = useOrganizationMembers(id.value)
		return { students, messages, MemberTypes, studentsImage, user }
	},
})
</script>
