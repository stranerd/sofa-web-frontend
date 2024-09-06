<template>
	<ExpandedLayout layoutStyle="mdlg:pb-4">
		<div
			class="w-full flex flex-col-reverse mdlg:flex-row gap-5 py-8 mdlg:py-0 mdlg:pt-8 px-10 mdlg:px-20 bg-primaryYellow justify-center items-center mdlg:h-[600px]">
			<div class="mdlg:w-[70%] h-full flex flex-col justify-center">
				<div class="w-[80%]">
					<SofaHeaderText
						color="text-primaryPurple"
						size="2xl"
						class="!font-extrabold"
						content="All contents made by verified creators" />

					<SofaNormalText color="text-black" customClass="py-4 text-left flex items-center justify-center">
						Everything here is carefully reviewed to ensure the highest quality and accuracy. By purchasing from our
						marketplace, you can have confidence in the credibility of the creators and the value of the materials.
					</SofaNormalText>
				</div>

				<div class="flex flex-col mdlg:flex-row mdlg:items-center gap-6 w-full">
					<div class="flex items-center gap-2">
						<img src="/images/marketplace/creators.png" alt="Creators" />
						<SofaHeaderText>120+ <span class="font-normal">Creators</span></SofaHeaderText>
					</div>
					<div class="flex items-center gap-2">
						<SofaIcon name="dropbox" class="bg-lightGray rounded-full p-2" />
						<SofaHeaderText>4500+ <span class="font-normal">Courses</span></SofaHeaderText>
					</div>
					<div class="flex items-center gap-2">
						<SofaIcon name="open-book" class="bg-lightGray rounded-full p-2" />
						<SofaHeaderText>12000+ <span class="font-normal">Resources</span></SofaHeaderText>
					</div>
				</div>

				<div
					class="w-[80%] shadow-custom px-4 py-2 my-4 bg-white rounded-custom hidden mdlg:flex gap-3 items-center justify-between">
					<form class="flex gap-2 items-center flex-1" @submit.prevent="handleSearch">
						<SofaIcon name="search-black" class="h-[17px] cursor-pointer w-[20px]" @click="handleSearch" />
						<SofaTextField v-model="searchQuery" class="flex-1" customClass="!border-none w-full" placeholder="Search" />
					</form>
				</div>
			</div>
			<div class="h-full flex justify-center items-center">
				<SofaImageLoader photoUrl="/images/marketplace/marketplace-hero.png" class="w-full h-full object-contain" />
			</div>
		</div>

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
			<div class="flex items-center gap-3">
				<!-- Icon for select component cannot be mutated -->
				<SofaNormalText size="xl" customClass="font-bold" content="Sort by" />
				<SofaSelect :options="[]" placeholder="Relevancy" class="border-2 rounded-3xl w-[157px] h-[44px] text-grayColor" />
			</div>
		</div>

		<!-- No longer needed -->
		<!-- <div class="w-full p-4 flex mdlg:hidden flex-col">
			<form
				class="w-full shadow-custom px-4 py-2 bg-white rounded-custom flex gap-2 items-center justify-start"
				@submit.prevent="handleSearch">
				<SofaIcon name="filter" class="h-[15px]" @click="$router.push('/marketplace/search')" />
				<SofaIcon name="search-black" class="h-[15px] cursor-pointer" @click="handleSearch" />
				<SofaTextField v-model="searchQuery" class="flex-1" customClass="!border-none w-full !px-0" placeholder="Search" />
			</form>
		</div> -->

		<div class="mdlg:w-[85%] lg:w-[75%] w-full flex flex-col h-full gap-8 mdlg:pl-0 pl-4">
			<template v-for="(material, index) in materials" :key="material.title">
				<div class="w-full flex flex-col mdlg:gap-4 gap-3">
					<div
						:class="[
							'w-full flex gap-2 pr-4 p-4 items-center justify-between bg-primaryGreen',
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
						class="mdlg:gap-4 flex gap-3 mdlg:p-0 pr-4 flex-nowrap overflow-x-auto scrollbar-hide items-start">
						<StudyMaterialCard v-for="m in material.list" :key="m.id" wrapped :material="m" class="mdlg:w-[20%]" />
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
