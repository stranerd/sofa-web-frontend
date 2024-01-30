<template>
	<LibraryLayout
		:title="user?.publicName ?? 'Not found'"
		:options="[
			{ name: 'All', id: 'all' },
			{ name: 'Courses', id: 'courses' },
			{ name: 'Quizzes', id: 'quizzes' },
		]">
		<template v-if="data.length">
			<SofaActivityCard
				v-for="activity in data"
				:key="activity.id"
				:activity="activity"
				:isWrapped="!Logic.Common.isLarge"
				customClass="mdlg:!bg-white shadow-custom cursor-pointer relative"
				@click="activity.type === 'course' ? openCourse(activity) : openQuiz(activity)">
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
			title="This organization has no items"
			subTitle="Whenever this organization creates an item, you will see it here" />
	</LibraryLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import LibraryLayout from '@app/components/study/LibraryLayout.vue'
import { extractResource, openCourse, openQuiz } from '@app/composables/library'
import { handleShowMaterialMoreOptions } from '@app/composables/study'
import { useUsersMaterials } from '@app/composables/study/users-materials'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'LibraryOrganizationsIdPage',
	components: { LibraryLayout },
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
