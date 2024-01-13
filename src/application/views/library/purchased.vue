<template>
	<LibraryLayout title="Purchased">
		<template v-if="data.length">
			<sofa-activity-card
				v-for="activity in data"
				:key="activity.id"
				:activity="activity"
				:is-wrapped="!Logic.Common.isLarge"
				:custom-class="'mdlg:!bg-white shadow-custom cursor-pointer relative'"
				@click="openCourse(activity)">
				<div class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
					<sofa-icon
						:name="'more-options-horizontal'"
						:custom-class="'h-[6px]'"
						@click.stop="handleShowMaterialMoreOptions(activity)" />
				</div>
			</sofa-activity-card>
		</template>

		<sofa-empty-state
			v-else
			:title="'You have not bought anything'"
			:action-label="'Marketplace'"
			:sub-title="'Discover thousands of materials to buy, created by verified experts'"
			:action="() => Logic.Common.GoToRoute('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from '@/components/study/LibraryLayout.vue'
import { extractResource, openCourse } from '@/composables/library'
import { handleShowMaterialMoreOptions } from '@/composables/study'
import { useMyPurchasedCourses } from '@/composables/study/courses-list'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { SofaActivityCard, SofaEmptyState, SofaIcon } from 'sofa-ui-components'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'LibraryPurchasedPage',
	components: {
		LibraryLayout,
		SofaIcon,
		SofaActivityCard,
		SofaEmptyState,
	},
	routeConfig: { goBackRoute: '/library' },
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { courses } = useMyPurchasedCourses()

		const data = computed(() => {
			if (tab.value === 'all') return courses.value.map(extractResource)
			return []
		})

		return { Logic, openCourse, data, handleShowMaterialMoreOptions }
	},
})
</script>
