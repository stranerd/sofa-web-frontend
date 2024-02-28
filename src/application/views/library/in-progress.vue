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
import { useRoute } from 'vue-router'
import LibraryLayout from '@app/components/study/LibraryLayout.vue'
import { useMyPlays } from '@app/composables/plays/plays'

export default defineComponent({
	name: 'LibraryInProgressPage',
	components: { LibraryLayout },
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { ongoing } = useMyPlays()

		const data = computed(() => {
			if (tab.value === 'all') return ongoing.value
			if (tab.value === 'games') return ongoing.value.filter((p) => p.isGames())
			if (tab.value === 'tests') return ongoing.value.filter((p) => p.isTests())
			return []
		})

		return { data }
	},
})
</script>
