<template>
	<LibraryLayout title="Quizzes">
		<template v-if="data.length">
			<SofaActivityCard
				v-for="activity in data"
				:key="activity.id"
				:activity="activity"
				:isWrapped="!Logic.Common.isLarge"
				:customClass="'mdlg:!bg-white shadow-custom cursor-pointer relative'"
				@click.stop="openQuiz(activity)">
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
			:title="'You have no quizzes here'"
			:actionLabel="'Explore'"
			:subTitle="'Discover thousands of quizzes and save them here for easy access'"
			:action="() => Logic.Common.GoToRoute('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from '@app/components/study/LibraryLayout.vue'
import { extractResource, openQuiz } from '@app/composables/library'
import { handleShowMaterialMoreOptions, useRecent } from '@app/composables/study'
import { useMyQuizzes, useTutorQuizzes } from '@app/composables/study/quizzes-list'
import { Logic } from 'sofa-logic'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

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
			if (tab.value === 'tutors') return tutorQuizzes.value.map(extractResource)
			else if (tab.value === 'recent') return recentQuizzes.value.map(extractResource)
			else if (tab.value === 'published') return published.value.map(extractResource)
			else if (tab.value === 'draft') return draft.value.map(extractResource)
			return []
		})

		return { Logic, data, openQuiz, handleShowMaterialMoreOptions }
	},
})
</script>
