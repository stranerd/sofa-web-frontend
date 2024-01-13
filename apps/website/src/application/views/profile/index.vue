<template>
	<div />
</template>

<script lang="ts">
import { useAuth } from '@/composables/auth/auth'
import { generateMiddlewares } from '@/middlewares'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProfilePage',
	beforeRouteEnter: generateMiddlewares([
		'isAuthenticated',
		async () => {
			const { id } = useAuth()
			return `/profile/${id.value}`
		},
	]),
})
</script>
