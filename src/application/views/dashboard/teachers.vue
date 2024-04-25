<template>
	<DashboardPageLayout
		title="Teachers"
		:breadcrumbs="[
			{ text: 'Home', to: '/dashboard' },
			{ text: 'Teachers', to: '/dashboard/teachers' },
		]"
		:filter="(query) => teachers.filter((m) => m.search(query))"
		:primary="{ label: 'Add teacher', action: add }">
		<template #default="{ extras }">
			<MembersList :org="user!" :type="type" :members="teachers" :filteredMembers="extras.filteredItems" />
		</template>
	</DashboardPageLayout>
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
	name: 'DashboardTeachersPage',
	components: { MembersList },
	routeConfig: { goBackRoute: '/dashboard', middlewares: ['isOrg'] },
	setup() {
		useMeta({ title: 'Teachers' })

		const { id, user } = useAuth()
		const { teachers } = useOrganizationMembers(id.value)
		const type = MemberTypes.teacher
		const add = () => useModals().organizations.addMember.open({ org: user.value!, type })
		return { teachers, type, add, user }
	},
})
</script>
