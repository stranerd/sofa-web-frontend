<template>
	<LibraryLayout title="Results">
		<template v-if="data.length">
			<SofaProgressItemCard
				v-for="play in data"
				:key="play.id"
				:content="play"
				customClass="!bg-white shadow-custom cursor-pointer"
				@click="play.action()" />
		</template>

		<SofaEmptyState
			v-else
			title="You have no practice item here"
			subTitle="Discover thousands of materials to buy, created by verified experts"
			actionLabel="Marketplace"
			:action="() => Logic.Common.GoToRoute('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import LibraryLayout from '@app/components/study/LibraryLayout.vue'
import { createGameData, createTestData } from '@app/composables/library'
import { useMyGames } from '@app/composables/plays/games-list'
import { useMyTests } from '@app/composables/plays/tests-list'
import { useQuizzesInList } from '@app/composables/study/quizzes-list'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'LibraryResultsPage',
	components: { LibraryLayout },
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { ended: endedGames } = useMyGames()
		const { ended: endedTests } = useMyTests()
		const { quizzes } = useQuizzesInList(computed(() => [...endedGames.value, ...endedTests.value].map((p) => p.quizId)))

		const data = computed(() => {
			if (tab.value === 'all')
				return [
					...endedGames.value.map((g) => createGameData(g, quizzes.value)),
					...endedTests.value.map((t) => createTestData(t, quizzes.value)),
				].sort((a, b) => b.createdAt - a.createdAt)
			if (tab.value === 'games') return endedGames.value.map((g) => createGameData(g, quizzes.value))
			if (tab.value === 'tests') return endedTests.value.map((t) => createTestData(t, quizzes.value))
			return []
		})

		return { Logic, data }
	},
})
</script>
