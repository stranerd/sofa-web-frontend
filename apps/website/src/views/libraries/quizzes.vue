<template>
	<LibraryLayout title="Quizzes">
		<div class="w-full flex flex-col gap-3 px-4 pt-3">
			<template v-if="currentQuizData.length">
				<sofa-activity-card v-for="activity in currentQuizData" :key="activity.id" :activity="activity"
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
		</div>

		<!-- More options -->
		<sofa-modal v-if="showMoreOptions" :close="() => showMoreOptions = false">
			<div class="mdlg:!w-[50%] mdlg:!h-full w-full h-auto md:w-[70%] flex flex-col items-center relative">
				<div
					class="bg-white w-full flex flex-col md:!gap-4 gap-1 mdlg:!p-6 md:!p-4 md:!rounded-[16px] rounded-t-2xl items-center justify-center">
					<div
						class="w-full flex justify-between items-center sticky top-0 left-0 md:!hidden py-2 px-4 border-[#F1F6FA] border-b">
						<sofa-normal-text :customClass="'!font-bold !text-base'">Options</sofa-normal-text>
						<sofa-icon :customClass="'h-[19px]'" :name="'circle-close'" @click="showMoreOptions = false" />
					</div>

					<div class="w-full flex flex-col gap-3 p-4">
						<div class="w-full flex items-center gap-2 py-3" v-for="item in moreOptions" :key="item.title"
							@click.stop="item.action()">
							<sofa-icon :name="item.icon" :customClass="'h-[15px]'" />
							<sofa-normal-text>{{ item.title }}</sofa-normal-text>
						</div>
					</div>
				</div>
			</div>
		</sofa-modal>
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
	showMoreOptions,
	TutorQuizzes
} from "@/composables/library"
import { Logic } from "sofa-logic"
import { Conditions } from "sofa-logic/src/logic/types/domains/common"
import { ResourceType } from "sofa-logic/src/logic/types/domains/study"
import {
	SofaActivityCard,
	SofaEmptyState,
	SofaIcon,
	SofaModal,
	SofaNormalText
} from "sofa-ui-components"
import { computed, defineComponent, onMounted, ref } from "vue"
import { useMeta } from "vue-meta"
import { useRoute } from 'vue-router'

export default defineComponent({
	components: {
		LibraryLayout,
		SofaIcon,
		SofaNormalText,
		SofaActivityCard,
		SofaModal,
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
			{
				domain: "Study",
				property: "Tags",
				method: "GetTags",
				params: [
					{
						where: [
							{
								field: "type",
								value: "topics",
								condition: "eq",
							},
						],
					},
				],
				requireAuth: true,
			},
		],
	},
	name: "LibraryQuizzes",
	setup () {
		useMeta({
			title: "Quizzes",
		})

		const route = useRoute()
		const tab = computed(() => route.query.tab as string ?? 'recent')

		const quizzes = ref<ResourceType[]>([])
		const tutorQuizzes = ref<ResourceType[]>([])
		const currentQuizData = computed(() => {
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
			currentQuizData,
			tab,
			showMoreOptionHandler,
			showMoreOptions,
			moreOptions,
			openQuiz,
		}
	},
})
</script>
