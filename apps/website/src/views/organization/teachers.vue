<template>
	<HomeLayout title="Teachers">
		<template #default="{ extras }">
			<MembersList
				:image="teachersImage"
				:type="MemberTypes.teacher"
				:members="teachers"
				:messages="messages"
				@openAddModal="extras.openAddModal"
				@acceptMember="extras.acceptMember"
				@removeMember="extras.removeMember" />
		</template>
	</HomeLayout>
</template>

<script lang="ts">
import MembersList from '@/components/organizations/members/MembersList.vue'
import HomeLayout from '@/components/home/HomeLayout.vue'
import { useAuth } from '@/composables/auth/auth'
import { useOrganizationMembers } from '@/composables/organizations/members'
import { generateMiddlewares } from '@/middlewares'
import { MemberTypes } from '@modules/organizations'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import teachersImage from '@/assets/images/class-teachers.png'

export default defineComponent({
	name: 'OrganizationTeachersPage',
	components: { HomeLayout, MembersList },
	middlewares: { goBackRoute: '/' },
	beforeRouteEnter: generateMiddlewares(['isOrg']),
	setup() {
		useMeta({ title: 'Teachers' })

		const messages = [
			'You can assign lessons to teachers.',
			'Send announcements to all teachers at once.',
			'Teachers can make announcements to students.',
			'Manage your all teachers in the same space.',
		]

		const { id } = useAuth()
		const { teachers } = useOrganizationMembers(id.value)
		return { teachers, messages, MemberTypes, teachersImage }
	},
})
</script>
