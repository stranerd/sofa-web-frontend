<template>
	<div />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth } from '@app/composables/auth/auth'

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
