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
import { useMyPlays } from '@app/composables/plays/plays'

export default defineComponent({
	name: 'LibraryResultsPage',
	components: { LibraryLayout },
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { ended } = useMyPlays()

		const data = computed(() => {
			if (tab.value === 'all') return ended.value
			if (tab.value === 'games') return ended.value.filter((p) => p.isGame())
			if (tab.value === 'tests') return ended.value.filter((p) => p.isTest())
			return []
		})

		return { data }
	},
})
</script>
