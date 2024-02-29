<template>
	<ExpandedLayout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<PlayRun :playId="$route.params.id as string" :type="type" />
	</ExpandedLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import { PlayTypes } from '@modules/plays'

export default defineComponent({
	name: 'PlaysTypeIdRunPage',
	routeConfig: {
		middlewares: [
			'isAuthenticated',
			async ({ to }) => {
				if (!Object.values(PlayTypes).includes(to.params.type as any)) return '/library'
			},
		],
	},
	setup() {
		useMeta({
			title: 'Run',
		})

		const route = useRoute()
		const type = route.params.type as PlayTypes
		return { type }
	},
})
</script>
