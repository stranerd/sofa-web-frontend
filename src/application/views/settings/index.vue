<template>
	<SettingsLayout title="Settings" :index="true" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import SettingsLayout from '@app/components/settings/SettingsLayout.vue'
import { Logic } from 'sofa-logic'

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
