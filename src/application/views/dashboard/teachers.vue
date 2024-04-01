<template>
	<HomeLayout title="Teachers">
		<template #default="{ user }">
			<MembersList :org="user" :image="teachersImage" :type="MemberTypes.teacher" :members="teachers" :messages="messages" />
		</template>
	</HomeLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import teachersImage from '@app/assets/images/class-teachers.png'
import MembersList from '@app/components/organizations/members/MembersList.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useOrganizationMembers } from '@app/composables/organizations/members'
import { MemberTypes } from '@modules/organizations'

export default defineComponent({
	name: 'OrganizationTeachersPage',
	components: { MembersList },
	routeConfig: { goBackRoute: '/dashboard', middlewares: ['isOrg'] },
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
