<template>
	<LibraryLayout title="Results">
		<template v-if="data.length">
			<sofa-progress-item-card
				v-for="play in data"
				:key="play.id"
				:content="play"
				:custom-class="'!bg-white shadow-custom cursor-pointer'"
				@click="play.action()" />
		</template>

		<sofa-empty-state
			v-else
			:title="'You have no practice item here'"
			:sub-title="'Discover thousands of materials to buy, created by verified experts'"
			:action-label="'Marketplace'"
			:action="() => Logic.Common.GoToRoute('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from '@/components/study/LibraryLayout.vue'
import { createGameData, createTestData } from '@/composables/library'
import { useMyGames } from '@/composables/plays/games-list'
import { useMyTests } from '@/composables/plays/tests-list'
import { useQuizzesInList } from '@/composables/study/quizzes-list'
import { Logic } from 'sofa-logic'
import { SofaEmptyState, SofaProgressItemCard } from 'sofa-ui-components'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'LibraryResultsPage',
	components: {
		LibraryLayout,
		SofaProgressItemCard,
		SofaEmptyState,
	},
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
