<template>
	<LibraryLayout
		:title="user?.orgName ?? 'Not found'"
		:options="[
			{ name: 'All', id: 'all' },
			{ name: 'Courses', id: 'courses' },
			{ name: 'Quizzes', id: 'quizzes' },
		]">
		<template v-if="data.length">
			<sofa-activity-card
				v-for="activity in data"
				:key="activity.id"
				:activity="activity"
				:is-wrapped="!Logic.Common.isLarge"
				:custom-class="'mdlg:!bg-white shadow-custom cursor-pointer relative'"
				@click="activity.type === 'course' ? openCourse(activity) : openQuiz(activity)">
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
			:title="'This organization has no items'"
			:sub-title="'Whenever this organization creates an item, you will see it here'" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from '@/components/study/LibraryLayout.vue'
import { extractResource, openCourse, openQuiz } from '@/composables/library'
import { handleShowMaterialMoreOptions } from '@/composables/study'
import { useUsersMaterials } from '@/composables/study/users-materials'
import { Logic } from 'sofa-logic'
import { SofaActivityCard, SofaEmptyState, SofaIcon } from 'sofa-ui-components'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'LibraryOrganizationsIdPage',
	components: {
		LibraryLayout,
		SofaIcon,
		SofaEmptyState,
		SofaActivityCard,
	},
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { user, courses, quizzes } = useUsersMaterials(route.params.id as string)

		const data = computed(() => {
			if (tab.value === 'all') return [...courses, ...quizzes].sort((a, b) => b.createdAt - a.createdAt).map(extractResource)
			if (tab.value === 'courses') return courses.map(extractResource)
			if (tab.value === 'quizzes') return quizzes.map(extractResource)
			return []
		})

		return { Logic, user, openQuiz, openCourse, data, handleShowMaterialMoreOptions }
	},
})
</script>
