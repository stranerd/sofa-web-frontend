<template>
	<LibraryLayout title="Courses">
		<template v-if="data.length">
			<StudyMaterialCard
				v-for="activity in data"
				:key="activity.hash"
				type="activity"
				:material="activity"
				:isWrapped="!$screen.desktop"
				:isRoute="false"
				:hasShowMore="true"
				class="mdlg:!bg-white"
				@click.stop="openMaterial(activity)" />
		</template>

		<SofaEmptyState
			v-else
			title="You have no course here"
			actionLabel="Explore"
			subTitle="Discover thousands of courses and save them here for easy access"
			:action="() => $router.push('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { openMaterial } from '@app/composables/library'
import { useRecent } from '@app/composables/study'
import { useMyCourses } from '@app/composables/study/courses-list'
import { DraftStatus } from '@modules/study'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'LibraryCoursesPage',
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'recent')

		const { published, draft } = useMyCourses()
		const { courses: recentCourses } = useRecent()

		const data = computed(() => {
			if (tab.value === 'recent') return recentCourses.value
			else if (tab.value === DraftStatus.published) return published.value
			else if (tab.value === DraftStatus.draft) return draft.value
			return []
		})

		return { Logic, openMaterial, data }
	},
})
</script>
