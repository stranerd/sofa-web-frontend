<template>
	<SettingsLayout title="Settings" :index="true" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'SettingsIndexPage',
	routeConfig: {
		goBackRoute: '/dashboard',
		middlewares: ['isAuthenticated', () => (Logic.Common.isLarge ? '/settings/profile' : undefined)],
	},
	setup() {
		useMeta({
			title: 'Settings',
		})
	},
})
</script>
