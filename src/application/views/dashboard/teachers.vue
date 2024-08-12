<template>
	<DashboardLayout
		title="Teachers"
		:breadcrumbs="[
			{ text: 'Home', to: '/dashboard' },
			{ text: 'Teachers', to: '/dashboard/teachers' },
		]"
		:primary="{ label: 'Add teacher', action: add }">
		<template #default="{ extras }">
			<MembersList
				:org="user!"
				:type="type"
				:members="teachers"
				:filteredMembers="teachers.filter((m) => m.search(extras.searchQuery))" />
		</template>
	</DashboardLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'
import MembersList from '@app/components/organizations/members/MembersList.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { useOrganizationMembers } from '@app/composables/organizations/members'
import { MemberTypes } from '@modules/organizations'

export default defineComponent({
	name: 'DashboardTeachersPage',
	components: { MembersList },
	routeConfig: { goBackRoute: '/dashboard', middlewares: ['isOrg'] },
	setup() {
		useHead({ title: 'Teachers' })

		const { id, user } = useAuth()
		const { teachers } = useOrganizationMembers(id.value)
		const type = MemberTypes.teacher
		const add = () => useModals().organizations.addMember.open({ org: user.value!, type })
		return { teachers, type, add, user }
	},
})
</script>
