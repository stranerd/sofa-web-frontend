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
import { useMyGames } from '@app/composables/plays/games'
import { useMyTests } from '@app/composables/plays/tests'

export default defineComponent({
	name: 'LibraryInProgressPage',
	components: { LibraryLayout },
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { ongoing: ongoingGames } = useMyGames()
		const { ongoing: ongoingTests } = useMyTests()

		const data = computed(() => {
			if (tab.value === 'all') return [...ongoingGames.value, ...ongoingTests.value].sort((a, b) => b.createdAt - a.createdAt)
			if (tab.value === 'games') return ongoingGames.value
			if (tab.value === 'tests') return ongoingTests.value
			return []
		})

		return { data }
	},
})
</script>
