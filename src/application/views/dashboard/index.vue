<template>
	<DashboardLayout title="Dashboard" :index="true">
		<DashboardForStudents v-if="userType.isStudent" />
		<DashboardForNonStudents v-else />
	</DashboardLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import DashboardForNonStudents from '@app/components/dashboard/DashboardForNonStudents.vue'
import DashboardForStudents from '@app/components/dashboard/DashboardForStudents.vue'
import { useAuth } from '@app/composables/auth/auth'

export default defineComponent({
	name: 'DashboardIndexPage',
	components: { DashboardForStudents, DashboardForNonStudents },
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Dashboard',
		})

		const { userType } = useAuth()
		return { userType }
	},
})
</script>
