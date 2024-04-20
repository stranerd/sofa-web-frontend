<template>
	<FullLayout :hide="{ top: true, right: true }">
		<template #left-session>
			<div class="w-full shadow-custom bg-white rounded-2xl flex flex-col h-full gap-4 p-4">
				<div class="flex items-center gap-2 shrink-0">
					<SofaIcon class="h-[14px]" name="filter" />
					<SofaNormalText class="!font-bold" content="Filter" />
				</div>

				<span class="h-0.5 bg-lightGray" />

				<MarketplaceFilter v-model="selectedOptions" class="grow overflow-y-auto" />
			</div>
		</template>

		<template #middle-session>
			<div class="w-full h-full flex flex-col mdlg:gap-5 gap-3 p-4 mdlg:p-0 mdlg:pr-4">
				<div class="flex gap-3 items-center">
					<SofaIcon class="h-[15px] mdlg:hidden" name="back-arrow" @click="$utils.goBack()" />
					<div class="flex mdlg:flex-row-reverse items-center grow bg-white rounded-custom px-3 gap-3">
						<SofaIcon name="search-black" class="h-[17px]" />
						<SofaTextField v-model="query" customClass="bg-transparent !px-0 !border-none" placeholder="Search for anything" />
					</div>
				</div>

				<div class="flex gap-3 items-center">
					<a
						v-for="(item, index) in filterOptions"
						:key="index"
						class="px-6 py-2 rounded-custom flex items-center justify-center gap-1"
						:class="item.id == selectedFilterOption ? 'bg-primaryPurple text-white' : 'bg-white text-deepGray'"
						@click="selectedFilterOption = item.id">
						<SofaNormalText color="text-current" class="!font-semibold" :content="item.name" />
					</a>
				</div>

				<div class="flex flex-col grow overflow-y-auto gap-3 mdlg:gap-5">
					<div v-if="selectedFilterOption === 'all' || selectedFilterOption === 'courses'" class="flex flex-col gap-3">
						<SofaNormalText v-if="selectedFilterOption == 'all'" class="font-bold"> Courses </SofaNormalText>

						<div
							v-if="courses.length"
							class="w-full flex flex-nowrap overflow-x-auto scrollbar-hide mdlg:grid mdlg:grid-cols-4 lg:grid-cols-5 gap-3 mdlg:gap-4">
							<StudyMaterialCard
								v-for="m in courses"
								:key="m.id"
								:type="$screen.desktop ? 'item' : 'activity'"
								:material="m"
								class="col-span-1" />
						</div>

						<SofaEmptyState
							v-else
							title="No result found"
							subTitle="We could not find any courses that matches your search"
							actionLabel="Clear search"
							:action="() => (query = '')" />
					</div>

					<div v-if="selectedFilterOption === 'all' || selectedFilterOption === 'quizzes'" class="flex flex-col gap-3">
						<SofaNormalText v-if="selectedFilterOption == 'all'" class="font-bold"> Quizzes </SofaNormalText>

						<div
							v-if="quizzes.length"
							class="w-full flex flex-nowrap overflow-x-auto scrollbar-hide mdlg:grid mdlg:grid-cols-4 lg:grid-cols-5 gap-3 mdlg:gap-4">
							<StudyMaterialCard
								v-for="m in quizzes"
								:key="m.id"
								:type="$screen.desktop ? 'item' : 'activity'"
								:material="m"
								class="col-span-1" />
						</div>

						<SofaEmptyState
							v-else
							title="No result found"
							subTitle="We could not find any quizzes that matches your search"
							actionLabel="Clear search"
							:action="() => (query = '')" />
					</div>
				</div>
			</div>

			<div class="mdlg:hidden px-4 flex flex-col w-full">
				<SofaButton
					class="bg-primaryPurple text-white rounded-custom py-3 flex items-center justify-center gap-2"
					@click="showFilter = true">
					<SofaIcon class="h-[14px] fill-current" name="filter" />
					<SofaNormalText class="!font-semibold !text-sm" color="text-current">Filter</SofaNormalText>
					<span class="px-2 bg-white rounded-full aspect-square flex justify-center items-center text-primaryPurple">
						<SofaNormalText color="text-current">{{ selectedOptions.length }}</SofaNormalText>
					</span>
				</SofaButton>
			</div>
		</template>
	</FullLayout>
	<SofaModal v-if="showFilter && !$screen.desktop" :close="() => (showFilter = false)" containerClass="h-[95%]">
		<div class="flex flex-col h-full gap-4 p-4">
			<div class="flex gap-3 items-center">
				<SofaIcon class="h-[13px]" name="filter" />
				<SofaNormalText class="!font-bold !text-base" content="Filters" />
				<SofaIcon class="h-[19px] ml-auto" name="circle-close" @click="showFilter = false" />
			</div>

			<span class="h-0.5 bg-lightGray" />

			<MarketplaceFilter v-model="selectedOptions" class="grow overflow-y-auto" />

			<SofaButton padding="py-3" @click="showFilter = false">Show results</SofaButton>
		</div>
	</SofaModal>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import MarketplaceFilter, { SelectedOption } from '@app/components/marketplace/Filter.vue'
import { useSearch } from '@app/composables/search'
import { SofaNormalText } from 'sofa-ui-components'

useMeta({
	title: 'Search',
})

const filterOptions = [
	{
		name: 'All',
		id: 'all',
	},
	{
		name: 'Courses',
		id: 'courses',
	},
	{
		name: 'Quizzes',
		id: 'quizzes',
	},
] as const

const route = useRoute()
const { q, userId, userName } = route.query as Record<string, string>
const { query, courses, quizzes, search } = useSearch(q)

const showFilter = ref(false)
const selectedFilterOption = ref<(typeof filterOptions)[number]['id']>(filterOptions[0].id)

const selectedOptions = reactive<SelectedOption[]>([
	...(userId && userName
		? ([
				{
					name: userName,
					id: userId,
					type: 'user',
					query: {
						field: 'user.id',
						value: userId,
					},
				},
			] as const)
		: []),
])

watch(
	[query, selectedOptions],
	() => {
		$utils.debounce('search', () => search(selectedOptions.map((option) => option.query)), 500)
	},
	{ immediate: true },
)
</script>
