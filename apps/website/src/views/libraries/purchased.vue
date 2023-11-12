<template>
	<LibraryLayout title="Purchased">
		<template v-if="data.length">
			<sofa-activity-card v-for="(activity, index) in data" :key="index" :activity="activity"
				:isWrapped="!Logic.Common.isLarge" :hasExtra="Logic.Common.isLarge"
				:custom-class="'mdlg:!bg-white shadow-custom cursor-pointer relative'" @click="openCourse(activity)">
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
					<sofa-icon :name="'more-options-horizontal'" :customClass="'h-[6px] '"
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
import {
	PurchasedCourses,
	createCourseData,
	moreOptions,
	openCourse,
	showMoreOptionHandler,
} from "@/composables/library"
import { Logic } from "sofa-logic"
import {
	SofaActivityCard,
	SofaEmptyState,
	SofaIcon,
	SofaNormalText,
} from "sofa-ui-components"
import { computed, defineComponent, onMounted } from "vue"
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
				domain: "Payment",
				property: "PurchasedItems",
				method: "GetUserPurchases",
				params: [true],
				requireAuth: true,
				ignoreProperty: false,
			},
		],
	},
	name: "LibraryPurchased",
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
			moreOptions,
			showMoreOptionHandler,
		}
	},
})
</script>
