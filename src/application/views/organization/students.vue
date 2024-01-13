<template>
	<HomeLayout title="Students">
		<template #default="{ user }">
			<MembersList :org="user" :image="studentsImage" :type="MemberTypes.student" :members="students" :messages="messages" />
		</template>
	</HomeLayout>
</template>

<script lang="ts">
import studentsImage from '@/assets/images/class-students.png'
import HomeLayout from '@/components/home/HomeLayout.vue'
import MembersList from '@/components/organizations/members/MembersList.vue'
import { useAuth } from '@/composables/auth/auth'
import { useOrganizationMembers } from '@/composables/organizations/members'
import { MemberTypes } from '@modules/organizations'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'OrganizationStudentsPage',
	components: { HomeLayout, MembersList },
	routeConfig: { goBackRoute: '/', middlewares: ['isOrg'] },
	setup() {
		useMeta({ title: 'Students' })

		const messages = [
			'Add students from your physical class here.',
			'Students here get your classes, courses, and quizzes for FREE.',
			'Your students can revisit live classes for revision purposes.',
			'No loss of study resources so students can keep coming back to them.',
		]

		const { id } = useAuth()
		const { students } = useOrganizationMembers(id.value)
		return { students, messages, MemberTypes, studentsImage }
	},
})
</script>
