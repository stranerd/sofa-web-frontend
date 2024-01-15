<template>
	<ExpandedLayout layoutStyle="mdlg:pb-4">
		<div class="w-full mdlg:flex hidden flex-col gap-5 pt-8 pb-14 bg-primaryPurple justify-center items-center">
			<SofaHeaderText color="text-white" size="xl" class="!font-extrabold" content="All contents made by verified creators" />

			<SofaNormalText color="text-white" customClass="w-[48%] text-center flex items-center justify-center">
				Everything here is carefully reviewed to ensure the highest quality and accuracy. By purchasing from our marketplace, you
				can have confidence in the credibility of the creators and the value of the materials.
			</SofaNormalText>

			<div class="w-[40%] shadow-custom px-4 py-2 bg-white rounded-custom flex gap-3 items-center justify-between">
				<div class="flex gap-2 items-center flex-1">
					<SofaIcon name="filter" class="h-[15px] cursor-pointer" @click="Logic.Common.GoToRoute('/marketplace/search')" />
					<SofaNormalText
						as="a"
						class="pr-2 border-r border-darkLightGray"
						content="Filter"
						@click="Logic.Common.GoToRoute('/marketplace/search')" />
					<SofaTextField
						v-model="searchQuery"
						class="flex-1"
						customClass="!border-none w-full"
						placeholder="Search for anything"
						@onEnter="handleSearch" />
				</div>

				<SofaIcon name="search-black" class="h-[17px] cursor-pointer w-[20px]" @click="handleSearch" />
			</div>
		</div>

		<div class="w-full p-4 flex mdlg:hidden flex-col">
			<div class="w-full shadow-custom px-4 py-2 bg-white rounded-custom flex gap-2 items-center justify-start">
				<SofaIcon name="filter" class="h-[15px] cursor-pointer" @click="Logic.Common.GoToRoute('/marketplace/search')" />
				<SofaIcon name="search-black" class="h-[15px] cursor-pointer" @click="handleSearch" />
				<SofaTextField
					v-model="searchQuery"
					class="flex-1"
					customClass="!border-none w-full !px-0"
					placeholder="Search"
					@onEnter="handleSearch" />
			</div>
		</div>

		<div class="mdlg:w-[85%] lg:w-[75%] w-full flex flex-col h-full overflow-y-auto gap-8 mdlg:pl-0 pl-4">
			<template v-for="material in materials" :key="material.title">
				<div class="w-full flex flex-col mdlg:gap-4 gap-3">
					<div class="w-full flex gap-2 pr-4 mdlg:pr-0 items-center justify-between">
						<SofaNormalText class="!font-bold" :content="material.title" />
						<SofaNormalText
							color="text-primaryPink"
							as="router-link"
							to="/marketplace/search"
							class="mdlg:hidden"
							content="View all" />
					</div>

					<div v-if="material.list.length" class="mdlg:gap-4 flex gap-3 mdlg:p-0 pr-4 flex-nowrap overflow-x-auto scrollbar-hide">
						<SofaItemCard
							v-for="activity in material.list.slice(0, 4)"
							:key="activity.id"
							as="router-link"
							:content="activity"
							:to="activity.route"
							:hasBookmark="true"
							:bookmarkAction="() => saveToFolder(activity.original)"
							class="flex-shrink-0 bg-white w-[220px] mdlg:w-[20%] shadow-itemBox" />
					</div>
					<div v-else class="pr-4 mdlg:pr-0">
						<SofaEmptyState :title="material.emptyTitle" :subTitle="material.emptySub" customClass="!h-[230px]" />
					</div>
				</div>
			</template>
		</div>
	</ExpandedLayout>
</template>

<script lang="ts">
import { extractResource } from '@app/composables/library'
import { useMyStudy } from '@app/composables/study'
import { saveToFolder } from '@app/composables/study/folders'
import { Logic } from 'sofa-logic'
import { computed, defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'MarketPlaceIndexPage',
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useMeta({
			title: 'Marketplace',
		})

		const searchQuery = ref('')

		const { materials: latest } = useMyStudy('latest')
		const { materials: popular } = useMyStudy('popular')
		const { materials: rated } = useMyStudy('rated')

		const handleSearch = () => {
			if (searchQuery.value) Logic.Common.GoToRoute('/marketplace/search?q=' + searchQuery.value)
		}

		const materials = computed(() => [
			{
				list: latest.value.map(extractResource),
				title: 'Latest',
				emptyTitle: 'No result found',
				emptySub: 'We could not find any latest materials',
			},
			{
				list: popular.value.map(extractResource),
				title: 'Most popular',
				emptyTitle: 'No result found',
				emptySub: 'We could not find any popular materials',
			},
			{
				list: rated.value.map(extractResource),
				title: 'Highest rated',
				emptyTitle: 'No result found',
				emptySub: 'We could not find any rated materials',
			},
		])

		return {
			materials,
			saveToFolder,
			Logic,
			searchQuery,
			handleSearch,
		}
	},
})
</script>
