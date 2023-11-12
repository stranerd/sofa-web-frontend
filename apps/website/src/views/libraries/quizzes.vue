<template>
	<LibraryLayout title="Quizzes">
		<template v-if="data.length">
			<sofa-activity-card v-for="activity in data" :key="activity.id" :activity="activity"
				:isWrapped="!Logic.Common.isLarge" :hasExtra="Logic.Common.isLarge"
				:custom-class="'mdlg:!bg-white shadow-custom cursor-pointer relative'" @click.stop="openQuiz(activity)">
				<template v-slot:extra>
					<div class="relative flex flex-row z-10 justify-end" :tabindex="Math.random() * 100"
						@blur="activity.showMore = false">
						<sofa-icon name="more-options-horizontal"
							customClass="h-[6px] hidden mdlg:!inline-block !cursor-pointer"
							@click.stop="showMoreOptionHandler(activity)" />
						<div class="absolute top-[80%] right-0 min-w-[300px] custom-border shadow-custom h-auto !bg-white flex flex-col !z-50"
							v-if="activity.showMore">
							<div class="w-full flex flex-row items-center gap-2 px-4 py-3 hover:bg-[#E5F2FD] custom-border"
								v-for="(item, index) in moreOptions.filter((o) => o.show())" :key="index"
								@click.stop="item.action()">
								<sofa-icon :name="item.icon" :customClass="'h-[15px]'" />
								<sofa-normal-text>
									{{ item.title }}
								</sofa-normal-text>
							</div>
						</div>
					</div>
					<span class="invisible">
						<sofa-icon name="edit-gray" :customClass="'h-[20px]'" />
					</span>
				</template>
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
	moreOptions,
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
	SofaNormalText
} from "sofa-ui-components"
import { computed, defineComponent, onMounted, ref } from "vue"
import { useRoute } from 'vue-router'

export default defineComponent({
	components: {
		LibraryLayout,
		SofaIcon,
		SofaNormalText,
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
	name: "LibraryQuizzes",
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
			moreOptions,
			openQuiz,
		}
	},
})
</script>
