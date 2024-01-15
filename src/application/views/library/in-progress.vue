<template>
	<LibraryLayout title="In Progress">
		<template v-if="data.length">
			<SofaProgressItemCard
				v-for="play in data"
				:key="play.id"
				:content="play"
				:custom-class="'!bg-white shadow-custom cursor-pointer'"
				@click="play.action()" />
		</template>

		<SofaEmptyState
			v-else
			:title="'You have no plays in progress'"
			:sub-title="'Discover thousands of materials to buy, created by verified experts'"
			:action-label="'Marketplace'"
			:action="() => Logic.Common.GoToRoute('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from '@app/components/study/LibraryLayout.vue'
import { createGameData, createTestData } from '@app/composables/library'
import { useMyGames } from '@app/composables/plays/games-list'
import { useMyTests } from '@app/composables/plays/tests-list'
import { useQuizzesInList } from '@app/composables/study/quizzes-list'
import { Logic } from 'sofa-logic'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'LibraryInProgressPage',
	components: { LibraryLayout },
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { ongoing: ongoingGames } = useMyGames()
		const { ongoing: ongoingTests } = useMyTests()
		const { quizzes } = useQuizzesInList(computed(() => [...ongoingGames.value, ...ongoingTests.value].map((p) => p.quizId)))

		const data = computed(() => {
			if (tab.value === 'all')
				return [
					...ongoingGames.value.map((g) => createGameData(g, quizzes.value)),
					...ongoingTests.value.map((t) => createTestData(t, quizzes.value)),
				].sort((a, b) => b.createdAt - a.createdAt)
			if (tab.value === 'games') return ongoingGames.value.map((g) => createGameData(g, quizzes.value))
			if (tab.value === 'tests') return ongoingTests.value.map((t) => createTestData(t, quizzes.value))
			return []
		})

		return { Logic, data }
	},
})
</script>
