<template>
	<ExpandedLayout layoutStyle="mdlg:pb-4">
		<form class="w-full flex items-center mdlg:hidden px-4">
			<div class="w-full flex items-center gap-3 z-50 justify-between bg-lightGray py-4 sticky top-0 left-0">
				<SofaIcon class="h-[15px]" name="arrow-left" @click="$utils.goBack()" />
				<SofaHeading content="Marketplace" />
				<span class="w-4" />
			</div>
			<SofaIcon name="search-black" class="h-[15px]" />
			<!-- <SofaInput v-model="searchQuery" class="flex-1 !bg-white !rounded-custom shadow-custom w-full" placeholder="Search">
				<template #prefix>
					<SofaIcon name="search-black" class="h-[15px]" />
				</template>
			</SofaInput> -->
		</form>
		<!-- Hero -->
		<HeroSection
			bgColor="bg-primaryYellow"
			headerColor="text-primaryPurple"
			headerContent="All contents made by verified creators"
			textColor="text-black"
			description="Everything here is carefully reviewed to ensure the highest quality and accuracy. By purchasing from our marketplace, you can have confidence in the credibility of the creators and the value of the materials."
			imageUrl="/images/marketplace/marketplace-hero.png"
			:searchQuery="searchQuery"
			@handleSearch="handleSearch" />

		<div class="w-full flex items-center justify-around py-4">
			<!-- Icon of select component cannot be changed, also icon fillColor cannot be changed -->
			<div>
				<div v-if="$screen.desktop" class="gap-3 flex items-center">
					<SofaSelect
						v-for="i in 4"
						:key="i"
						:options="[]"
						placeholder="Subject"
						class="border-2 rounded-3xl w-[157px] h-[44px] text-grayColor" />
				</div>
				<SofaSelect v-else :options="[]" placeholder="Subject" class="border-2 rounded-3xl w-[157px] h-[44px] text-grayColor" />
			</div>
			<div class="flex items-center gap-2">
				<!-- Icon for select component cannot be mutated -->
				<SofaNormalText size="xl" customClass="font-bold whitespace-nowrap hidden mdlg:block" content="Sort by" />
				<SofaSelect
					:options="[]"
					:placeholder="$screen.desktop ? 'Relevancy' : 'Filter'"
					class="border-2 rounded-3xl w-[157px] h-[44px] text-grayColor" />
			</div>
		</div>

		<!-- Materials -->
		<div class="mdlg:w-[85%] lg:w-[75%] w-full flex flex-col h-full gap-8 mdlg:pl-0">
			<template v-for="(material, index) in materials" :key="material.title">
				<div class="w-full flex flex-col mdlg:gap-4 gap-3">
					<div
						:class="[
							'w-full flex gap-2 p-4 items-center justify-between bg-primaryGreen',
							index === 0 ? 'bg-primaryYellow' : '',
							index === 1 ? 'bg-primaryPurple' : '',
							index === 2 ? 'bg-primaryPink' : '',
						]">
						<SofaNormalText class="!font-bold text-white" :content="material.title" />
						<SofaNormalText color="text-white" as="router-link" to="/marketplace/search" class="inline-flex items-center gap-1">
							See all
							<SofaIcon name="alt-arrow-right" class="h-[15px] fill-white" />
						</SofaNormalText>
					</div>

					<div
						v-if="material.list.length"
						class="mdlg:gap-4 flex gap-3 mdlg:p-0 px-4 flex-nowrap overflow-x-auto scrollbar-hide items-start">
						<StudyMaterialCard v-for="m in material.list" :key="m.id" wrapped :material="m" class="mdlg:w-[20%]" />
					</div>
					<div v-else class="pr-4 mdlg:pr-0">
						<SofaEmptyState :title="material.emptyTitle" :subTitle="material.emptySub" customClass="!h-[230px]" />
					</div>
				</div>
				<!-- Between first and second template-->
				<div v-if="index === 0" class="w-full flex flex-col py-4">
					x
					<!-- Your custom content here -->
					<div class="w-full flex gap-2 px-4 pb-4 items-center justify-between">
						<SofaNormalText class="!font-bold !text-black" content="Topics recommended for you" />
						<SofaNormalText
							color="text-primaryPink"
							as="router-link"
							to="/marketplace/search"
							class="inline-flex items-center gap-1"
							content="View all" />
					</div>
					<div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mdlg:p-0 px-4">
						<SofaNormalText
							v-for="i in 10"
							:key="i"
							content="Organic Chemistry"
							class="border p-2 border-deepGray mdlg:w-[180px] mdlg:h-[50px] flex justify-center whitespace-nowrap" />
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
import HeroSection from '../../components/marketplace/HeroSection.vue'
import { useMyStudy } from '@app/composables/study'

export default defineComponent({
	name: 'MarketPlaceIndexPage',
	routeConfig: { middlewares: ['isAuthenticated'] },
	components: {
		HeroSection,
	},
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
