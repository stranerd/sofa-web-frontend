<template>
	<div />
</template>

<script lang="ts">
import { useAuth } from '@/composables/auth/auth'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProfilePage',
	routeConfig: {
		middlewares: [
			'isAuthenticated',
			async () => {
				const { id } = useAuth()
				return `/profile/${id.value}`
			},
		],
	},
})
</script>
