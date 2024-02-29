<template>
	<ExpandedLayout layoutStyle="!justify-between" :hide="{ top: true, bottom: true }">
		<PlayRun :playId="$route.params.id as string" :type="PlayTypes.tests" />
	</ExpandedLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { PlayTypes } from '@modules/plays'

export default defineComponent({
	name: 'TestsIdRunPage',
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Run',
		})

		return { PlayTypes }
	},
})
</script>
