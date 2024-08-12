<template>
	<SettingsLayout title="Settings" :index="true" />
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'SettingsIndexPage',
	routeConfig: {
		goBackRoute: '/dashboard',
		middlewares: ['isAuthenticated', () => ($screen.desktop ? '/settings/profile' : undefined)],
	},
	setup() {
		useHead({
			title: 'Settings',
		})
	},
})
</script>
