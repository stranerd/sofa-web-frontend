<template>
	<LibraryLayout title="Purchased">
		<template v-if="data.length">
			<SofaActivityCard
				v-for="activity in data"
				:key="activity.id"
				:activity="activity"
				:isWrapped="!Logic.Common.isLarge"
				customClass="mdlg:!bg-white shadow-custom cursor-pointer relative"
				@click="openMaterial(activity.original)">
				<div class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
					<SofaIcon
						name="more-options-horizontal"
						customClass="h-[6px]"
						@click.stop="(e) => handleShowMaterialMoreOptions(e, activity)" />
				</div>
			</SofaActivityCard>
		</template>

		<SofaEmptyState
			v-else
			title="You have not bought anything"
			actionLabel="Marketplace"
			subTitle="Discover thousands of materials to buy, created by verified experts"
			:action="() => Logic.Common.GoToRoute('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import LibraryLayout from '@app/components/study/LibraryLayout.vue'
import { extractResource, openMaterial } from '@app/composables/library'
import { handleShowMaterialMoreOptions } from '@app/composables/study'
import { useMyPurchasedCourses } from '@app/composables/study/courses-list'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'LibraryPurchasedPage',
	components: { LibraryLayout },
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { courses } = useMyPurchasedCourses()

		const data = computed(() => {
			if (tab.value === 'all') return courses.value.map(extractResource)
			return []
		})

		return { Logic, openMaterial, data, handleShowMaterialMoreOptions }
	},
})
</script>
