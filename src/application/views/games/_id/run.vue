<template>
	<ExpandedLayout layoutStyle="!justify-between bg-deepGray text-white" :hide="{ top: true, bottom: true }" bgImage="/images/game-bg.png">
		<PlayRun :playId="$route.params.id as string" :type="PlayTypes.games" :dark="true" />
	</ExpandedLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { PlayTypes } from '@modules/plays'

export default defineComponent({
	name: 'GamesIdRunPage',
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Run',
		})

		return { PlayTypes }
	},
})
</script>
