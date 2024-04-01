<template>
	<HomeLayout title="Dashboard" :index="true">
		<HomeForStudents v-if="userType.isStudent" />
		<HomeForNonStudents v-else />
	</HomeLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import HomeForNonStudents from '@app/components/home/HomeForNonStudents.vue'
import HomeForStudents from '@app/components/home/HomeForStudents.vue'
import { useAuth } from '@app/composables/auth/auth'

export default defineComponent({
	name: 'DashboardPage',
	components: { HomeForStudents, HomeForNonStudents },
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
