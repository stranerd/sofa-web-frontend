<template>
	<LibraryLayout :title="SingleFolder?.title ?? 'Not Found'" :options="[
		{ name: 'All', id: 'all' },
		{ name: 'Courses', id: 'courses' },
		{ name: 'Quizzes', id: 'quizzes' },
	]">
		<template v-if="data.length">
			<sofa-activity-card v-for="(activity, index) in data" :key="index" :activity="activity"
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
import { SingleFolder, createCourseData, createQuizData, openCourse, openQuiz, showMoreOptionHandler } from "@/composables/library"
import { Logic } from "sofa-logic"
import { SofaActivityCard, SofaEmptyState, SofaIcon } from "sofa-ui-components"
import { computed, defineComponent, onMounted } from "vue"
import { useRoute } from 'vue-router'

export default defineComponent({
	components: {
		LibraryLayout,
		SofaIcon,
		SofaEmptyState,
		SofaActivityCard,
	},
	middlewares: {
		fetchRules: [
			{
				domain: "Study",
				property: "SingleFolder",
				method: "GetFolder",
				params: [],
				useRouteId: true,
				requireAuth: true,
				ignoreProperty: true,
			},
		],
	},
	name: "LibraryFoldersIdPage",
	setup () {
		const route = useRoute()
		const tab = computed(() => route.query.tab as string ?? 'all')

		const FolderItems = computed(() => [
			SingleFolder.value?.courses?.map(createCourseData) ?? [],
			SingleFolder.value?.quizzes?.map(createQuizData) ?? []
		].flat())

		const data = computed(() => {
			if (tab.value === 'courses') return FolderItems.value.filter((i) => i.labels.main.toLocaleLowerCase().includes('course'))
			if (tab.value === 'quizzes') return FolderItems.value.filter((i) => i.labels.main.toLocaleLowerCase().includes('quiz'))
			return FolderItems.value
		})

		onMounted(() => {
			Logic.Study.watchProperty("SingleFolder", SingleFolder)
		})

		return {
			Logic,
			SingleFolder,
			openQuiz,
			openCourse,
			data,
			showMoreOptionHandler,
			tab,
		}
	},
})
</script>