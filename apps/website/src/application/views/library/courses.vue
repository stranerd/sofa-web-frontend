<template>
	<LibraryLayout title="Courses">
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
			:title="'You have no course here'"
			:action-label="'Explore'"
			:sub-title="'Discover thousands of courses and save them here for easy access'"
			:action="() => Logic.Common.GoToRoute('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from '@/components/study/LibraryLayout.vue'
import { extractResource, openCourse } from '@/composables/library'
import { useRecent, handleShowMaterialMoreOptions } from '@/composables/study'
import { useMyCourses } from '@/composables/study/courses-list'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { SofaActivityCard, SofaEmptyState, SofaIcon } from 'sofa-ui-components'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'LibraryCoursesPage',
	components: {
		LibraryLayout,
		SofaIcon,
		SofaActivityCard,
		SofaEmptyState,
	},
	middlewares: { goBackRoute: '/library' },
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'recent')

		const { published, draft } = useMyCourses()
		const { courses: recentCourses } = useRecent()

		const data = computed(() => {
			if (tab.value === 'recent') return recentCourses.value.map(extractResource)
			else if (tab.value === 'published') return published.value.map(extractResource)
			else if (tab.value === 'draft') return draft.value.map(extractResource)
			return []
		})

		return { Logic, openCourse, data, handleShowMaterialMoreOptions }
	},
})
</script>
