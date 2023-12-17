<template>
	<LibraryLayout :title="user?.type?.name ?? user?.bio.name.full ?? 'Not found'" :options="[
		{ name: 'All', id: 'all' },
		{ name: 'Courses', id: 'courses' },
		{ name: 'Quizzes', id: 'quizzes' },
	]">
		<template v-if="data.length">
			<sofa-activity-card v-for="activity in data" :key="activity.id" :activity="activity"
				:isWrapped="!Logic.Common.isLarge" :custom-class="'mdlg:!bg-white shadow-custom cursor-pointer relative'"
				@click="activity.type === 'course' ? openCourse(activity) : openQuiz(activity)">
				<div class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
					<sofa-icon :name="'more-options-horizontal'" :customClass="'h-[6px]'"
						@click.stop="showMoreOptionHandler(activity)" />
				</div>
			</sofa-activity-card>
		</template>

		<sofa-empty-state v-else :title="'This organization has no items'"
			:subTitle="'Whenever this organization creates an item, you will see it here'" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from '@/components/library/LibraryLayout.vue'
import { createCourseData, createQuizData, openCourse, openQuiz, showMoreOptionHandler } from '@/composables/library'
import { useUsersMaterials } from '@/composables/study/users-materials'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { SofaActivityCard, SofaEmptyState, SofaIcon } from 'sofa-ui-components'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
	components: {
		LibraryLayout,
		SofaIcon,
		SofaEmptyState,
		SofaActivityCard,
	},
	name: 'LibraryOrganizationsIdPage',
	middlewares: { goBackRoute: '/library' },
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup () {
		const route = useRoute()
		const tab = computed(() => route.query.tab as string ?? 'all')

		const { user, courses, quizzes } = useUsersMaterials(route.params.id as string)

		const data = computed(() => {
			if (tab.value === 'all') return [
				...courses.map(createCourseData),
				...quizzes.map(createQuizData)
			].sort((a, b) => b.createdAt - a.createdAt)
			if (tab.value === 'courses') return courses.map(createCourseData)
			if (tab.value === 'quizzes') return quizzes.map(createQuizData)
			return []
		})

		return { Logic, user, openQuiz, openCourse, data, showMoreOptionHandler }
	},
})
</script>