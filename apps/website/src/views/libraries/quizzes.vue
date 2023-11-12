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
import {
	AllQuzzies,
	createQuizData,
	openQuiz,
	showMoreOptionHandler,
	TutorQuizzes
} from "@/composables/library"
import { Logic } from "sofa-logic"
import { Conditions } from "sofa-logic/src/logic/types/domains/common"
import { ResourceType } from "sofa-logic/src/logic/types/domains/study"
import {
	SofaActivityCard,
	SofaEmptyState,
	SofaIcon,
} from "sofa-ui-components"
import { computed, defineComponent, onMounted, ref } from "vue"
import { useRoute } from 'vue-router'

export default defineComponent({
	components: {
		LibraryLayout,
		SofaIcon,
		SofaActivityCard,
		SofaEmptyState,
	},
	middlewares: {
		fetchRules: [
			{
				domain: "Study",
				property: "AllQuzzies",
				method: "GetQuizzes",
				params: [
					{
						where: [
							{
								field: "user.id",
								value: Logic.Auth.AuthUser?.id,
								condition: Conditions.eq,
							},
						],
					},
				],
				requireAuth: true,
				ignoreProperty: true,
			},
			{
				domain: "Study",
				property: "TutorQuizzes",
				method: "GetTutorQuizzes",
				requireAuth: true,
				ignoreProperty: true,
				shouldSkip: () => !(Logic.Auth.AuthUser && Logic.Auth.AuthUser.roles.isAdmin),
				params: [
					{
						where: [
							{
								field: "user.id",
								value: Logic.Auth.AuthUser?.id,
								condition: Conditions.eq,
							},
						],
					},
				]
			},
		],
	},
	name: "LibraryQuizzesPage",
	setup () {
		const route = useRoute()
		const tab = computed(() => route.query.tab as string ?? 'recent')

		const quizzes = ref<ResourceType[]>([])
		const tutorQuizzes = ref<ResourceType[]>([])
		const data = computed(() => {
			if (tab.value === "tutors") return tutorQuizzes.value
			else if (tab.value === "recent") return quizzes.value
			return quizzes.value.filter((quiz) => quiz.status === tab.value)
		})

		onMounted(() => {
			Logic.Study.watchProperty("AllQuzzies", AllQuzzies)
			Logic.Study.watchProperty("TutorQuizzes", TutorQuizzes)

			quizzes.value = AllQuzzies.value?.results.map(createQuizData) ?? []
			tutorQuizzes.value = TutorQuizzes.value?.results.map(createQuizData) ?? []
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
