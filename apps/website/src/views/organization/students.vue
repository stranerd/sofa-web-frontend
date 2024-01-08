<template>
	<HomeLayout title="Students">
		<template #default="{ extras }">
			<MembersList
				:image="studentsImage"
				:type="MemberTypes.student"
				:members="students"
				:messages="messages"
				@openAddModal="extras.openAddModal"
				@acceptMember="extras.acceptMember"
				@removeMember="extras.removeMember" />
		</template>
	</HomeLayout>
</template>

<script lang="ts">
import studentsImage from '@/assets/images/class-students.png'
import HomeLayout from '@/components/home/HomeLayout.vue'
import MembersList from '@/components/organizations/members/MembersList.vue'
import { useAuth } from '@/composables/auth/auth'
import { useOrganizationMembers } from '@/composables/organizations/members'
import { generateMiddlewares } from '@/middlewares'
import { MemberTypes } from '@modules/organizations'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'OrganizationStudentsPage',
	components: { HomeLayout, MembersList },
	middlewares: { goBackRoute: '/' },
	beforeRouteEnter: generateMiddlewares(['isOrg']),
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
