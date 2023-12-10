<template>
	<LibraryLayout title="Purchased">
		<template v-if="data.length">
			<sofa-activity-card v-for="activity in data" :key="activity.id" :activity="activity"
				:isWrapped="!Logic.Common.isLarge" :custom-class="'mdlg:!bg-white shadow-custom cursor-pointer relative'"
				@click="openCourse(activity)">
				<div class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
					<sofa-icon :name="'more-options-horizontal'" :customClass="'h-[6px]'"
						@click.stop="showMoreOptionHandler(activity)" />
				</div>
			</sofa-activity-card>
		</template>

		<sofa-empty-state v-else :title="'You have not bought anything'" :actionLabel="'Marketplace'"
			:subTitle="'Discover thousands of materials to buy, created by verified experts'"
			:action="() => Logic.Common.GoToRoute('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from '@/components/library/LibraryLayout.vue'
import { createCourseData, openCourse, showMoreOptionHandler } from "@/composables/library"
import { useMyPurchasedCourses } from '@/composables/study/courses-list'
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
	name: "LibraryPurchasedPage",
	beforeRouteEnter: generateMiddlewares(['isAuthenticated']),
	setup () {
		const route = useRoute()
		const tab = computed(() => route.query.tab as string ?? 'all')

		const { courses } = useMyPurchasedCourses()

		const data = computed(() => {
			if (tab.value === 'all') return courses.value.map(createCourseData)
			return []
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
