<template>
	<LibraryLayout :title="SingleUser?.type?.name ?? 'Not Found'" :options="[
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

		<sofa-empty-state v-else :title="'This organization has no items'"
			:subTitle="'Whenever this organization creates an item, you will see it here'" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from '@/components/library/LibraryLayout.vue'
import { createCourseData, createQuizData, openCourse, openQuiz, showMoreOptionHandler } from "@/composables/library"
import { Logic } from "sofa-logic"
import { ResourceType, QueryParams } from 'sofa-logic'
import { SofaActivityCard, SofaEmptyState, SofaIcon } from "sofa-ui-components"
import { computed, defineComponent, onMounted, ref, watch } from "vue"
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
				domain: "Users",
				property: "SingleUser",
				method: "GetUser",
				params: [],
				useRouteId: true,
				ignoreProperty: true,
			},
		],
	},
	name: "LibraryOrganizationsIdPage",
	setup () {
		const route = useRoute()
		const tab = computed(() => route.query.tab as string ?? 'all')

		const SingleUser = ref(Logic.Users.SingleUser)

		const items = ref<ResourceType[]>([])

		const data = computed(() => {
			if (tab.value === 'courses') return items.value.filter((i) => i.type === 'course')
			if (tab.value === 'quizzes') return items.value.filter((i) => i.type === 'quiz')
			return items.value
		})

		watch(SingleUser, async () => {
			const query: QueryParams = {
				where: [{ field: "user.id", value: SingleUser.value?.id ?? '' }],
				all: true,
				sort: [{ field: 'createdAt', desc: true }]
			}
			const courses = await Logic.Study.GetCourses(query, false)
			const quizzes = await Logic.Study.GetQuizzes(query)
			items.value = [
				...courses.results.map(createCourseData),
				...quizzes.results.map(createQuizData),
			].sort((a, b) => b.createdAt - a.createdAt)
		})

		onMounted(() => {
			Logic.Users.watchProperty("SingleUser", SingleUser)
		})

		return {
			Logic,
			SingleUser,
			openQuiz,
			openCourse,
			data,
			showMoreOptionHandler,
			tab,
		}
	},
})
</script>