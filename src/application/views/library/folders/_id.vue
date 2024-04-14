<template>
	<LibraryLayout
		:title="folder?.title ?? 'Not Found'"
		:options="[
			{ name: 'All', id: 'all' },
			{ name: 'Courses', id: 'courses' },
			{ name: 'Quizzes', id: 'quizzes' },
		]">
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
			title="There are no items in this folder"
			subTitle="Save quiz and courses to this folder and you will see them here" />
	</LibraryLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { openMaterial } from '@app/composables/library'
import { useCoursesInList } from '@app/composables/study/courses-list'
import { useFolder } from '@app/composables/study/folders'
import { useQuizzesInList } from '@app/composables/study/quizzes-list'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'LibraryFoldersIdPage',
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'all')

		const { folder } = useFolder(route.params.id as string)

		const { quizzes } = useQuizzesInList(computed(() => folder.value?.saved.quizzes ?? []))
		const { courses } = useCoursesInList(computed(() => folder.value?.saved.courses ?? []))

		const data = computed(() => {
			if (tab.value === 'all') return [...courses.value, ...quizzes.value].sort((a, b) => b.createdAt - a.createdAt)
			if (tab.value === 'courses') return courses.value
			if (tab.value === 'quizzes') return quizzes.value
			return []
		})

		return { Logic, folder, openMaterial, data }
	},
})
</script>
