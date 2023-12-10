<template>
	<LibraryLayout title="In Progress">
		<template v-if="data.length">
			<sofa-progress-item-card v-for="play in data" :key="play.id" :content="play"
				:custom-class="'!bg-white shadow-custom cursor-pointer'" @click="play.action()" />
		</template>

		<sofa-empty-state v-else :title="'You have no plays in progress'"
			:subTitle="'Discover thousands of materials to buy, created by verified experts'" :actionLabel="'Marketplace'"
			:action="() => Logic.Common.GoToRoute('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from "@/components/library/LibraryLayout.vue"
import { createGameData, createTestData } from '@/composables/library'
import { useMyGames } from '@/composables/plays/games-list'
import { useMyTests } from '@/composables/plays/tests-list'
import { Logic } from "sofa-logic"
import { SofaEmptyState, SofaProgressItemCard } from "sofa-ui-components"
import { computed, defineComponent } from "vue"
import { useRoute } from 'vue-router'

export default defineComponent({
	components: {
		LibraryLayout,
		SofaProgressItemCard,
		SofaEmptyState,
	},
	name: "LibraryInProgressPage",
	setup () {
		const route = useRoute()
		const tab = computed(() => route.query.tab as string ?? 'all')

		const { ongoing: ongoingGames } = useMyGames()
		const { ongoing: ongoingTests } = useMyTests()

		const data = computed(() => {
			if (tab.value === "all") return [
				...ongoingGames.value.map((g) => createGameData(g, [])),
				...ongoingTests.value.map((t) => createTestData(t, [])),
			].sort((a, b) => b.createdAt - a.createdAt)
			if (tab.value === "games") return ongoingGames.value.map((g) => createGameData(g, []))
			if (tab.value === "tests") return ongoingTests.value.map((t) => createTestData(t, []))
			return []
		})

		return {
			Logic,
			tab,
			data,
		}
	},
})
</script>
