<template>
	<DashboardLayout
		title="Students"
		:breadcrumbs="[
			{ text: 'Home', to: '/dashboard' },
			{ text: 'Students', to: '/dashboard/students' },
		]"
		:filter="(query) => students.filter((m) => m.search(query))"
		:primary="{ label: 'Add student', action: add }">
		<template #default="{ extras }">
			<MembersList :org="user!" :type="type" :members="students" :filteredMembers="extras.filteredItems" />
		</template>
	</DashboardLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useModals } from '@app/composables/core/modals'
import MembersList from '@app/components/organizations/members/MembersList.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useOrganizationMembers } from '@app/composables/organizations/members'
import { MemberTypes } from '@modules/organizations'

export default defineComponent({
	name: 'DashboardStudentsPage',
	components: { MembersList },
	routeConfig: { goBackRoute: '/dashboard', middlewares: ['isOrg'] },
	setup() {
		useMeta({ title: 'Students' })

		const { id, user } = useAuth()
		const { students } = useOrganizationMembers(id.value)
		const type = MemberTypes.student
		const add = () => useModals().organizations.addMember.open({ org: user.value!, type })
		return { students, type, add, user }
	},
})
</script>
