<template>
	<LibraryLayout title="Quizzes">
		<template v-if="data.length">
			<SofaStudyMaterial
				v-for="activity in data"
				:key="activity.hash"
				type="activity"
				:material="activity"
				:isWrapped="!Logic.Common.isLarge"
				:isRoute="false"
				:hasShowMore="true"
				class="mdlg:!bg-white"
				@click.stop="openMaterial(activity)" />
		</template>

		<SofaEmptyState
			v-else
			title="You have no quizzes here"
			actionLabel="Explore"
			subTitle="Discover thousands of quizzes and save them here for easy access"
			:action="() => $router.push('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import LibraryLayout from '@app/components/study/LibraryLayout.vue'
import { openMaterial } from '@app/composables/library'
import { useRecent } from '@app/composables/study'
import { useMyQuizzes, useTutorQuizzes } from '@app/composables/study/quizzes-list'
import { Logic } from 'sofa-logic'
import { DraftStatus } from '@modules/study'

export default defineComponent({
	name: 'LibraryQuizzesPage',
	components: { LibraryLayout },
	routeConfig: { goBackRoute: '/library', middlewares: ['isAuthenticated'] },
	setup() {
		const route = useRoute()
		const tab = computed(() => (route.query.tab as string) ?? 'recent')

		const { published, draft } = useMyQuizzes()
		const { quizzes: tutorQuizzes } = useTutorQuizzes()
		const { quizzes: recentQuizzes } = useRecent()

		const data = computed(() => {
			if (tab.value === 'tutors') return tutorQuizzes.value
			else if (tab.value === 'recent') return recentQuizzes.value
			else if (tab.value === DraftStatus.published) return published.value
			else if (tab.value === DraftStatus.draft) return draft.value
			return []
		})

		return { Logic, data, openMaterial }
	},
})
</script>
