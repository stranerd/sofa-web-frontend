<template>
	<LibraryLayout title="Results">
		<template v-if="data.length">
			<PlayCard v-for="play in data" :key="play.id" :play="play" />
		</template>

		<SofaEmptyState
			v-else
			title="You have no practice item here"
			subTitle="Discover thousands of materials to buy, created by verified experts"
			actionLabel="Marketplace"
			:action="() => $router.push('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import LibraryLayout from '@app/components/study/LibraryLayout.vue'
import { useMyGames } from '@app/composables/plays/games'
import { useMyTests } from '@app/composables/plays/tests'

export default defineComponent({
	name: 'LibraryResultsPage',
	components: { LibraryLayout },
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { ended: endedGames } = useMyGames()
		const { ended: endedTests } = useMyTests()

		const data = computed(() => {
			if (tab.value === 'all') return [...endedGames.value, ...endedTests.value].sort((a, b) => b.createdAt - a.createdAt)
			if (tab.value === 'games') return endedGames.value
			if (tab.value === 'tests') return endedTests.value
			return []
		})

		return { data }
	},
})
</script>
