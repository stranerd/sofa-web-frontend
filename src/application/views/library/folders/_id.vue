<template>
	<LibraryLayout
		:title="folder?.title ?? 'Not Found'"
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
				:customClass="'mdlg:!bg-white shadow-custom cursor-pointer relative'"
				@click="activity.type === 'course' ? openCourse(activity) : openQuiz(activity)">
				<div class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
					<SofaIcon
						:name="'more-options-horizontal'"
						:customClass="'h-[6px]'"
						@click.stop="(e) => handleShowMaterialMoreOptions(e, activity)" />
				</div>
			</SofaActivityCard>
		</template>

		<SofaEmptyState
			v-else
			:title="'There are no items in this folder'"
			:subTitle="'Save quiz and courses to this folder and you will see them here'" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from '@app/components/study/LibraryLayout.vue'
import { extractResource, openCourse, openQuiz } from '@app/composables/library'
import { handleShowMaterialMoreOptions } from '@app/composables/study'
import { useCoursesInList } from '@app/composables/study/courses-list'
import { useFolder } from '@app/composables/study/folders'
import { useQuizzesInList } from '@app/composables/study/quizzes-list'
import { Logic } from 'sofa-logic'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'LibraryFoldersIdPage',
	components: { LibraryLayout },
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { folder } = useFolder(route.params.id as string)

		const { quizzes } = useQuizzesInList(computed(() => folder.value?.saved.quizzes ?? []))
		const { courses } = useCoursesInList(computed(() => folder.value?.saved.courses ?? []))

		const data = computed(() => {
			if (tab.value === 'all')
				return [...courses.value, ...quizzes.value].sort((a, b) => b.createdAt - a.createdAt).map(extractResource)
			if (tab.value === 'courses') return courses.value.map(extractResource)
			if (tab.value === 'quizzes') return quizzes.value.map(extractResource)
			return []
		})

		return { Logic, folder, openQuiz, openCourse, data, handleShowMaterialMoreOptions }
	},
})
</script>
