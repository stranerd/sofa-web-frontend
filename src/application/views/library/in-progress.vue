<template>
	<LibraryLayout title="In Progress">
		<template v-if="data.length">
			<PlayCard v-for="play in data" :key="play.id" :play="play" />
		</template>

		<SofaEmptyState
			v-else
			title="You have no plays in progress"
			subTitle="Discover thousands of materials to buy, created by verified experts"
			actionLabel="Marketplace"
			:action="() => $router.push('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from '@app/composables/core/routes'
import { useMyPlays } from '@app/composables/plays/plays'

export default defineComponent({
	name: 'LibraryInProgressPage',
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { ongoing } = useMyPlays()

		const data = computed(() => {
			if (tab.value === 'all') return ongoing.value
			return ongoing.value.filter((p) => p.data.type === tab.value)
		})

		return { data }
	},
})
</script>
