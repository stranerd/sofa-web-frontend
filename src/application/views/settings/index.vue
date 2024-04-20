<template>
	<SettingsLayout title="Settings" :index="true" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'SettingsIndexPage',
	routeConfig: {
		goBackRoute: '/dashboard',
		middlewares: ['isAuthenticated', () => ($screen.desktop ? '/settings/profile' : undefined)],
	},
	setup() {
		useMeta({
			title: 'Settings',
		})
	},
})
</script>
