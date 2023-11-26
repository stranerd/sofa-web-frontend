<template>
	<LibraryLayout title="Courses">
		<template v-if="data.length">
			<sofa-activity-card v-for="(activity, index) in data" :key="index" :activity="activity"
				:isWrapped="!Logic.Common.isLarge" :custom-class="'mdlg:!bg-white shadow-custom cursor-pointer relative'"
				@click="openCourse(activity)">
				<div class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
					<sofa-icon :name="'more-options-horizontal'" :customClass="'h-[6px]'"
						@click.stop="showMoreOptionHandler(activity)" />
				</div>
			</sofa-activity-card>
		</template>

		<sofa-empty-state v-else :title="'You have no course here'" :actionLabel="'Explore'"
			:subTitle="'Discover thousands of courses and save them here for easy access'"
			:action="() => Logic.Common.GoToRoute('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from "@/components/library/LibraryLayout.vue"
import { RecentMaterials, createCourseData, openCourse, recentEntities, showMoreOptionHandler } from "@/composables/library"
import { Conditions, Logic, ResourceType } from "sofa-logic"
import { SofaActivityCard, SofaEmptyState, SofaIcon } from "sofa-ui-components"
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
				property: "AllCourses",
				method: "GetCourses",
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
				domain: 'Study',
				property: "RecentMaterials",
				method: 'GetRecentMaterials',
				requireAuth: true,
				ignoreProperty: true,
				params: []
			}
		],
	},
	name: "LibraryCoursesPage",
	setup () {
		const AllCourses = ref(Logic.Study.AllCourses)

		const route = useRoute()
		const tab = computed(() => route.query.tab as string ?? 'recent')

		const courses = ref<ResourceType[]>([])

		const data = computed(() => {
			if (tab.value === "recent") return recentEntities.value.filter((e) => e.type === "course")
			return courses.value.filter((course) => course.status === tab.value)
		})

		onMounted(() => {
			Logic.Study.watchProperty("AllCourses", AllCourses)
			Logic.Study.watchProperty("RecentMaterials", RecentMaterials)
			courses.value = AllCourses.value?.results.map(createCourseData) ?? []
		})

		return {
			Logic,
			tab,
			openCourse,
			data,
			showMoreOptionHandler,
		}
	},
})
</script>
