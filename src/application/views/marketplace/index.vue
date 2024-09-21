<template>
	<ExpandedLayout layoutStyle="mdlg:pb-4">
		<div class="w-full mdlg:flex hidden flex-col gap-5 pt-8 pb-14 bg-primaryPurple text-white justify-center items-center">
			<SofaHeading size="title" content="All contents made by verified creators" />

			<SofaText class="w-[48%] text-center flex items-center justify-center">
				Everything here is carefully reviewed to ensure the highest quality and accuracy. By purchasing from our marketplace, you
				can have confidence in the credibility of the creators and the value of the materials.
			</SofaText>

			<form class="w-[40%] shadow-custom">
				<SofaInput v-model="searchQuery" placeholder="Search for anything" type="search" class="!bg-white">
					<template #prefix>
						<SofaIcon name="filter" class="h-[15px]" @click="$router.push('/marketplace/search')" />
						<SofaText
							as="router-link"
							class="pr-2 border-r shrink-0 border-darkLightGray"
							content="Filter"
							to="/marketplace/search" />
					</template>
					<template #suffix>
						<SofaIcon name="search-black" class="h-[16px]" @click="handleSearch" />
					</template>
				</SofaInput>
			</form>
		</div>

		<form class="w-full p-4 mdlg:hidden" @submit.prevent="handleSearch">
			<SofaInput v-model="searchQuery" placeholder="Search" type="search" class="!bg-white">
				<template #prefix>
					<SofaIcon name="filter" class="h-[15px]" @click="$router.push('/marketplace/search')" />
					<SofaIcon name="search-black" class="h-[15px]" @click="handleSearch" />
				</template>
			</SofaInput>
		</form>

		<div class="mdlg:w-[85%] lg:w-[75%] w-full flex flex-col h-full overflow-y-auto gap-8 mdlg:pl-0 pl-4">
			<template v-for="material in materials" :key="material.title">
				<div class="w-full flex flex-col mdlg:gap-4 gap-3">
					<div class="w-full flex gap-2 pr-4 mdlg:pr-0 items-center justify-between">
						<SofaHeading :content="material.title" />
						<SofaText as="router-link" to="/marketplace/search" class="text-primaryPink mdlg:hidden" content="View all" />
					</div>

					<div
						v-if="material.list.length"
						class="mdlg:gap-4 flex gap-3 mdlg:p-0 pr-4 flex-nowrap overflow-x-auto scrollbar-hide items-start">
						<StudyMaterialCard v-for="m in material.list" :key="m.id" wrapped :material="m" class="mdlg:w-[20%]" />
					</div>
					<div v-else class="pr-4 mdlg:pr-0">
						<SofaEmptyState :title="material.emptyTitle" :subTitle="material.emptySub" class="!h-[230px]" />
					</div>
				</div>
			</template>
		</div>
	</ExpandedLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMyStudy } from '@app/composables/study'

export default defineComponent({
	name: 'MarketPlaceIndexPage',
	routeConfig: { middlewares: ['isAuthenticated'] },
	setup() {
		useHead({
			title: 'Marketplace',
		})

		const searchQuery = ref('')
		const router = useRouter()

		const { materials: latest } = useMyStudy('latest')
		const { materials: popular } = useMyStudy('popular')
		const { materials: rated } = useMyStudy('rated')

		const handleSearch = () => {
			if (searchQuery.value) router.push('/marketplace/search?q=' + searchQuery.value)
		}

		const materials = computed(() => [
			{
				list: latest.value,
				title: 'Latest',
				emptyTitle: 'No result found',
				emptySub: 'We could not find any latest materials',
			},
			{
				list: popular.value,
				title: 'Most popular',
				emptyTitle: 'No result found',
				emptySub: 'We could not find any popular materials',
			},
			{
				list: rated.value,
				title: 'Highest rated',
				emptyTitle: 'No result found',
				emptySub: 'We could not find any rated materials',
			},
		])

		return {
			materials,
			searchQuery,
			handleSearch,
		}
	},
})
</script>
