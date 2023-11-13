<template>
	<LibraryLayout title="Purchased">
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

		<sofa-empty-state v-else :title="'You have not bought anything'" :actionLabel="'Marketplace'"
			:subTitle="'Discover thousands of materials to buy, created by verified experts'"
			:action="() => Logic.Common.GoToRoute('/marketplace')" />
	</LibraryLayout>
</template>

<script lang="ts">
import LibraryLayout from '@/components/library/LibraryLayout.vue'
import { PurchasedCourses, createCourseData, openCourse, showMoreOptionHandler } from "@/composables/library"
import { Logic } from "sofa-logic"
import { SofaActivityCard, SofaEmptyState, SofaIcon } from "sofa-ui-components"
import { computed, defineComponent, onMounted } from "vue"
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
				domain: "Payment",
				property: "PurchasedItems",
				method: "GetUserPurchases",
				params: [true],
				requireAuth: true,
				ignoreProperty: false,
			},
		],
	},
	name: "LibraryPurchasedPage",
	setup () {
		const route = useRoute()
		const tab = computed(() => route.query.tab as string ?? 'all')

		const PurchasedData = computed(() => (PurchasedCourses.value?.results ?? []).map(createCourseData))
		const data = computed(() => PurchasedData.value)

		onMounted(() => {
			Logic.Study.watchProperty("PurchasedCourses", PurchasedCourses)
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
