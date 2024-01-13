<template>
	<HomeLayout title="Dashboard" :index="true">
		<HomeForStudents v-if="userType.isStudent" />
		<HomeForNonStudents v-else />
	</HomeLayout>
</template>

<script lang="ts">
import HomeForNonStudents from '@/components/home/HomeForNonStudents.vue'
import HomeForStudents from '@/components/home/HomeForStudents.vue'
import HomeLayout from '@/components/home/HomeLayout.vue'
import { useAuth } from '@/composables/auth/auth'
import { generateMiddlewares } from '@/middlewares'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'IndexPage',
	components: { HomeLayout, HomeForStudents, HomeForNonStudents },
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup() {
		useMeta({
			title: 'Dashboard',
		})

		const { userType } = useAuth()
		return { userType }
	},
})
</script>
