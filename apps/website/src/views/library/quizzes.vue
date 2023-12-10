<template>
	<LibraryLayout title="Quizzes">
		<template v-if="data.length">
			<sofa-activity-card v-for="activity in data" :key="activity.id" :activity="activity"
				:isWrapped="!Logic.Common.isLarge" :custom-class="'mdlg:!bg-white shadow-custom cursor-pointer relative'"
				@click.stop="openQuiz(activity)">
				<div class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
					<sofa-icon name="more-options-horizontal" customClass="h-[6px]"
						@click.stop="showMoreOptionHandler(activity)" />
				</div>
			</sofa-activity-card>
		</template>
		<sofa-empty-state v-else :title="'You have no quizzes here'" :actionLabel="'Explore'"
			:subTitle="'Discover thousands of quizzes and save them here for easy access'"
			:action="() => Logic.Common.GoToRoute('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from "@/components/library/LibraryLayout.vue"
import { createQuizData, openQuiz, showMoreOptionHandler } from "@/composables/library"
import { useMyQuizzes, useTutorQuizzes } from '@/composables/study/quizzes-list'
import { useRecent } from '@/composables/study/study'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from "sofa-logic"
import { SofaActivityCard, SofaEmptyState, SofaIcon } from "sofa-ui-components"
import { computed, defineComponent } from "vue"
import { useRoute } from 'vue-router'

export default defineComponent({
	components: {
		LibraryLayout,
		SofaIcon,
		SofaActivityCard,
		SofaEmptyState,
	},
	name: "LibraryQuizzesPage",
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup () {
		const route = useRoute()
		const tab = computed(() => route.query.tab as string ?? 'recent')

		const { published, draft } = useMyQuizzes()
		const { quizzes: tutorQuizzes } = useTutorQuizzes()
		const { quizzes: recentQuizzes } = useRecent()

		const data = computed(() => {
			if (tab.value === "tutors") return tutorQuizzes.value.map(createQuizData)
			else if (tab.value === "recent") return recentQuizzes.value.map(createQuizData)
			else if (tab.value === "published") return published.value.map(createQuizData)
			else if (tab.value === "draft") return draft.value.map(createQuizData)
			return []
		})

		return {
			Logic,
			data,
			tab,
			showMoreOptionHandler,
			openQuiz,
		}
	},
})
</script>
