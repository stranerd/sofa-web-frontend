<template>
	<SettingsLayout title="Settings" :index="true" />
</template>

<script lang="ts">
import SettingsLayout from '@/components/settings/SettingsLayout.vue'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'SettingsIndexPage',
	components: { SettingsLayout },
	beforeRouteEnter: generateMiddlewares([async () => (Logic.Common.isLarge ? '/settings/profile' : undefined)]),
	middlewares: { goBackRoute: '/' },
	setup() {
		useMeta({
			title: 'Settings',
		})
	},
})
</script>
