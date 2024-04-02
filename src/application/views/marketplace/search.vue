<template>
	<FullLayout :hide="{ top: true, right: true }">
		<template #left-session>
			<div class="w-full shadow-custom pb-6 bg-white rounded-custom relative flex flex-col h-full gap-6 overflow-y-auto">
				<div class="w-full flex items-center p-4 bg-white sticky top-0 left-0 gap-2 pb-3 border-b border-lightGray">
					<SofaIcon customClass="h-[14px]" name="filter" />
					<SofaNormalText customClass="!font-bold" content="Filter" />
				</div>

				<MarketplaceFilter v-model="selectedOptions" />
			</div>
		</template>

		<template #middle-session>
			<div class="w-full h-full flex flex-col flex-grow overflow-y-auto mdlg:!gap-5 gap-3 px-0 mdlg:!pr-7">
				<div
					class="w-full mdlg:!shadow-custom mdlg:!px-4 sticky mdlg:!relative top-0 px-4 left-0 mdlg:!top-auto mdlg:!left-auto z-30 mdlg:!py-1 pl-2 pr-4 py-4 pb-2 mdlg:!bg-white bg-lightGray mdlg:rounded-custom flex flex-row gap-3 items-center mdlg:!justify-between justify-start">
					<SofaIcon customClass="h-[15px] mdlg:!hidden pl-2" name="back-arrow" @click="Logic.Common.goBack()" />
					<div
						class="flex flex-row items-center flex-grow rounded-custom w-full px-3 mdlg:!px-0 mdlg:!bg-transparent md:!shadow-none shadow-custom bg-white">
						<SofaIcon name="search-black" customClass="h-[17px] mdlg:hidden" />
						<SofaTextField v-model="searchQuery" customClass="!border-none w-full mdlg:!pl-0" placeholder="Search for anything">
						</SofaTextField>
					</div>

					<div class="w-[20px] hidden mdlg:!inline-block">
						<SofaIcon name="search-black" customClass="h-[17px]" />
					</div>
				</div>

				<div class="w-full flex gap-3 items-center mdlg:px-0 pl-4">
					<span
						v-for="(item, index) in filterOptions"
						:key="index"
						:class="`px-6 py-2 ${
							item.id == selectedFilterOption ? 'bg-primaryPurple' : 'bg-white'
						} rounded-custom flex items-center justify-center gap-1 cursor-pointer`"
						@click="selectedFilterOption = item.id">
						<SofaNormalText
							:color="`${item.id == selectedFilterOption ? 'text-white' : 'text-deepGray'}`"
							customClass="!font-semibold"
							:content="item.name" />
					</span>
				</div>

				<!-- Course contents -->

				<div
					v-if="selectedFilterOption == 'all' || selectedFilterOption == 'courses'"
					class="w-full flex flex-col gap-3 mdlg:px-0 pl-4">
					<div v-if="selectedFilterOption == 'all'" class="w-full flex flex-col justify-start items-start">
						<SofaNormalText customClass="font-bold"> Courses </SofaNormalText>
					</div>

					<template v-if="resourceContents.length">
						<div class="w-full flex flex-col gap-3">
							<div v-if="Logic.Common.isLarge" class="w-full mdlg:grid mdlg:grid-cols-4 lg:grid-cols-5 mdlg:gap-4">
								<StudyMaterialCard v-for="m in resourceContents" :key="m.id" type="item" :material="m" class="col-span-1" />
							</div>

							<div
								class="lg:w-full mdlg:hidden flex gap-3 mdlg:gap-0 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
								<div class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 pr-4">
									<StudyMaterialCard v-for="m in resourceContents" :key="m.hash" type="activity" :material="m" />
								</div>
							</div>
						</div>
					</template>

					<template v-else>
						<div class="w-full flex flex-col gap-3 md:!pr-0 pr-4">
							<SofaEmptyState
								title="No result found"
								subTitle="We could not find any course that matches your search"
								actionLabel="Clear search"
								:action="() => (searchQuery = '')" />
						</div>
					</template>
				</div>

				<!-- Quiz contents -->
				<div
					v-if="selectedFilterOption == 'all' || selectedFilterOption == 'quizzes'"
					class="w-full flex flex-col gap-3 mdlg:px-0 pl-4">
					<div v-if="selectedFilterOption == 'all'" class="w-full flex flex-col justify-start items-start">
						<SofaNormalText customClass="font-bold"> Quizzes </SofaNormalText>
					</div>

					<template v-if="quizContents.length">
						<div class="w-full flex flex-col gap-3">
							<div v-if="Logic.Common.isLarge" class="w-full mdlg:grid mdlg:grid-cols-4 lg:grid-cols-5 mdlg:gap-4">
								<StudyMaterialCard v-for="m in quizContents" :key="m.hash" type="item" :material="m" class="col-span-1" />
							</div>

							<div
								class="lg:w-full mdlg:hidden flex gap-3 mdlg:gap-0 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
								<div class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 pr-4">
									<StudyMaterialCard v-for="m in quizContents" :key="m.hash" type="activity" :material="m" />
								</div>
							</div>
						</div>
					</template>

					<template v-else>
						<div class="w-full flex flex-col gap-3 md:!pr-0 pr-4">
							<SofaEmptyState
								title="No result found"
								subTitle="We could not find any quiz that matches your search"
								actionLabel="Clear search"
								:action="() => (searchQuery = '')" />
						</div>
					</template>
				</div>
			</div>

			<!-- Bottom filter for sm screens -->
			<div class="bg-lightGray mdlg:!hidden px-4 flex flex-col w-full">
				<div class="bg-primaryPurple rounded-custom py-3 flex items-center justify-center gap-2" @click="showFilter = true">
					<SofaIcon customClass="h-[14px]" name="filter-white" />
					<SofaNormalText customClass="!font-semibold !text-sm" color="text-white">Filter</SofaNormalText>
					<span class="w-[24px] h-[24px] bg-white rounded-full flex items-center justify-center">
						<SofaNormalText color="text-primaryPurple">{{ selectedOptions.length }}</SofaNormalText>
					</span>
				</div>
			</div>

			<SofaModalOld v-if="showFilter" :close="() => (showFilter = false)" customClass="mdlg:!hidden">
				<div
					class="mdlg:!w-[70%] mdlg:!hidden bg-white lg:!w-[60%] px-0 pt-0 h-[95%] max-h-[95%] w-full flex flex-col rounded-t-[16px] gap-4 relative overflow-y-auto"
					@click.stop="() => {}">
					<div class="w-full flex px-4 py-3 justify-between items-center bg-white sticky top-0 left-0 border-b border-lightGray">
						<div class="flex items-center gap-3">
							<SofaIcon customClass="h-[13px]" name="filter" />
							<SofaNormalText customClass="!font-bold !text-base" content="Filters" />
						</div>
						<SofaIcon customClass="h-[19px]" name="circle-close" @click="showFilter = false" />
					</div>

					<MarketplaceFilter v-model="selectedOptions" :close="() => (showFilter = false)" />
				</div>
			</SofaModalOld>
		</template>
	</FullLayout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useMeta } from 'vue-meta'
import MarketplaceFilter, { SelectedOption } from '@app/components/marketplace/Filter.vue'
import { search } from '@app/composables/marketplace'
import { DraftStatus } from '@modules/study'
import { Conditions, Logic, QueryParams } from 'sofa-logic'

export default defineComponent({
	name: 'MarketplaceSearchPage',
	components: { MarketplaceFilter },
	routeConfig: {
		fetchRules: [
			{
				domain: 'Study',
				property: 'AllCourses',
				method: 'GetCoursesWithQuery',
				params: [],
				requireAuth: true,
				ignoreProperty: true,
				useRouteQuery: true,
				queries: ['userId', 'tagId', 'q'],
			},
			{
				domain: 'Study',
				property: 'AllQuzzies',
				method: 'GetQuizzesWithQuery',
				params: [],
				requireAuth: true,
				ignoreProperty: true,
				useRouteQuery: true,
				queries: ['userId', 'tagId', 'q'],
			},
			{
				domain: 'Study',
				property: 'AllTopics',
				method: 'GetTopics',
				params: [],
				requireAuth: true,
			},
			{
				domain: 'Study',
				property: 'AllOtherTags',
				method: 'GetOtherTags',
				params: [],
				requireAuth: true,
			},
		],
	},
	setup() {
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
		]

		const AllCourses = ref(Logic.Study.AllCourses)
		const AllQuzzies = ref(Logic.Study.AllQuzzies)
		const resourceContents = computed(() => AllCourses.value?.results ?? [])
		const quizContents = computed(() => AllQuzzies.value?.results ?? [])
		const showFilter = ref(false)
		const selectedFilterOption = ref(filterOptions[0].id)
		const searchQuery = ref(Logic.Common.route.query?.q?.toString() ?? '')

		const selectedOptions = reactive<SelectedOption[]>([
			...(Logic.Common.route.query?.userId && Logic.Common.route.query?.userName
				? [
						{
							name: Logic.Common.route.query.userName.toString(),
							id: Logic.Common.route.query.userId.toString(),
							type: 'user',
							query: {
								field: 'user.id',
								value: Logic.Common.route.query.userId.toString(),
								condition: Conditions.eq,
							},
						},
					]
				: []),
		])

		const fetchSearchResults = () => {
			const allQueries: QueryParams = {
				where: [
					{
						field: 'status',
						value: DraftStatus.published,
						condition: Conditions.eq,
					},
					...selectedOptions.map((option) => option.query),
				],
				sort: [{ field: 'createdAt', desc: true }],
				limit: 20,
				...(searchQuery.value
					? {
							search: {
								value: searchQuery.value,
								fields: ['title', 'user.bio.name.first', 'user.bio.name.last', 'user.bio.name.full', 'user.bio.publicName'],
							},
						}
					: {}),
			}

			Logic.Common.debounce(() => {
				search(allQueries)
			}, 500)
		}

		onMounted(() => {
			Logic.Study.watchProperty('AllCourses', AllCourses)
			Logic.Study.watchProperty('AllQuzzies', AllQuzzies)
			fetchSearchResults()
		})

		watch([searchQuery, selectedOptions], fetchSearchResults)

		return {
			resourceContents,
			Logic,
			searchQuery,
			selectedOptions,
			showFilter,
			quizContents,
			filterOptions,
			selectedFilterOption,
			search,
		}
	},
})
</script>

<style scoped>
.textarea[contenteditable]:empty::before {
	content: 'Enter message';
	color: #78828c;
}
</style>
