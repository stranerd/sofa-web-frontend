<template>
	<LibraryLayout :title="folder?.title ?? 'Not Found'" :options="[
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

		<sofa-empty-state v-else :title="'There are no items in this folder'"
			:subTitle="'Save quiz and courses to this folder and you will see them here'" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from '@/components/library/LibraryLayout.vue'
import { createCourseData, createQuizData, openCourse, openQuiz, showMoreOptionHandler } from "@/composables/library"
import { useCoursesInList } from '@/composables/study/courses-list'
import { useFolder } from '@/composables/study/folders'
import { useQuizzesInList } from '@/composables/study/quizzes-list'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from "sofa-logic"
import { SofaActivityCard, SofaEmptyState, SofaIcon } from "sofa-ui-components"
import { computed, defineComponent } from "vue"
import { useRoute } from 'vue-router'

export default defineComponent({
	components: {
		LibraryLayout,
		SofaIcon,
		SofaEmptyState,
		SofaActivityCard,
	},
	name: "LibraryFoldersIdPage",
	middlewares: { goBackRoute: '/library' },
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup () {
		const route = useRoute()
		const tab = computed(() => route.query.tab as string ?? 'all')

		const { folder } = useFolder(route.params.id as string)

		const { quizzes } = useQuizzesInList(computed(() => folder.value?.saved.quizzes ?? []))
		const { courses } = useCoursesInList(computed(() => folder.value?.saved.courses ?? []))

		const data = computed(() => {
			if (tab.value === 'all') return [
				...courses.value.map(createCourseData),
				...quizzes.value.map(createQuizData)
			].sort((a, b) => b.createdAt - a.createdAt)
			if (tab.value === 'courses') return courses.value.map(createCourseData)
			if (tab.value === 'quizzes') return quizzes.value.map(createQuizData)
			return []
		})

		return { Logic, folder, openQuiz, openCourse, data, showMoreOptionHandler }
	},
})
</script>