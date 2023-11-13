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
import { AllGames, AllTests, GameAndTestQuizzes, plays } from "@/composables/library"
import { Logic } from "sofa-logic"
import { Conditions } from "sofa-logic/src/logic/types/domains/common"
import { SofaEmptyState, SofaProgressItemCard } from "sofa-ui-components"
import { computed, defineComponent, onMounted } from "vue"
import { useRoute } from 'vue-router'

export default defineComponent({
	components: {
		LibraryLayout,
		SofaProgressItemCard,
		SofaEmptyState,
	},
	middlewares: {
		fetchRules: [
			{
				domain: "Plays",
				property: "AllGames",
				method: "GetGames",
				params: [
					{
						where: [
							{
								field: "user.id",
								value: Logic.Auth.AuthUser?.id,
								condition: Conditions.eq,
							},
						],
						all: true,
						sort: [
							{
								field: "createdAt",
								desc: true,
							},
						]
					},
				],
				requireAuth: true,
				ignoreProperty: false,
			},
			{
				domain: "Plays",
				property: "AllTests",
				method: "GetTests",
				params: [
					{
						where: [
							{
								field: "user.id",
								value: Logic.Auth.AuthUser?.id,
								condition: Conditions.eq,
							},
						],
						all: true,
						sort: [
							{
								field: "createdAt",
								desc: true,
							},
						]
					},
				],
				requireAuth: true,
				ignoreProperty: false,
			},
		],
	},
	name: "LibraryInProgressPage",
	setup () {
		const route = useRoute()
		const tab = computed(() => route.query.tab as string ?? 'all')

		const data = computed(() => {
			const inProgress = plays.value.filter((p) => p.inProgress)
			if (tab.value === "games") return inProgress.filter((p) => p.type === "game")
			if (tab.value === "tests") return inProgress.filter((p) => p.type === "test")
			return inProgress
		})

		onMounted(async () => {
			Logic.Plays.watchProperty("AllTests", AllTests)
			Logic.Plays.watchProperty("AllGames", AllGames)
			Logic.Plays.watchProperty("GameAndTestQuizzes", GameAndTestQuizzes)
			await Logic.Plays.GetGameAndTestQuizzes()
		})

		return {
			Logic,
			tab,
			data,
		}
	},
})
</script>
