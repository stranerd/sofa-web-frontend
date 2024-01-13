<template>
	<SettingsLayout title="Settings" :index="true" />
</template>

<script lang="ts">
import SettingsLayout from '@/components/settings/SettingsLayout.vue'
import { Logic } from 'sofa-logic'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'SettingsIndexPage',
	components: { SettingsLayout },
	routeConfig: { goBackRoute: '/', middlewares: [() => (Logic.Common.isLarge ? '/settings/profile' : undefined)] },
	setup() {
		useMeta({
			title: 'Settings',
		})
	},
})
</script>
