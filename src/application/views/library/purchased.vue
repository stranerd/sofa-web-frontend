<template>
	<LibraryLayout title="Purchased">
		<template v-if="data.length">
			<StudyMaterialCard
				v-for="activity in data"
				:key="activity.hash"
				type="activity"
				:material="activity"
				:isWrapped="!Logic.Common.isLarge"
				:isRoute="false"
				:hasShowMore="true"
				class="mdlg:!bg-white"
				@click.stop="openMaterial(activity)" />
		</template>

		<SofaEmptyState
			v-else
			title="You have not bought anything"
			actionLabel="Marketplace"
			subTitle="Discover thousands of materials to buy, created by verified experts"
			:action="() => $router.push('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { openMaterial } from '@app/composables/library'
import { useMyPurchasedCourses } from '@app/composables/study/courses-list'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'LibraryPurchasedPage',
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { courses } = useMyPurchasedCourses()

		const data = computed(() => {
			if (tab.value === 'all') return courses.value
			return []
		})

		return { Logic, openMaterial, data }
	},
})
</script>
