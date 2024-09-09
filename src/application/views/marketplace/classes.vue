<template>
	<ExpandedLayout>
		<form class="w-full flex items-center mdlg:hidden px-4">
			<div class="w-full flex items-center gap-3 z-50 justify-between bg-lightGray py-4 sticky top-0 left-0">
				<SofaIcon class="h-[15px]" name="arrow-left" @click="$utils.goBack()" />
				<SofaHeading content="Explore Classes" />
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
			bgColor="bg-purple"
			headerColor="text-white"
			headerContent="All contents made by verified"
			:showOrganization="true"
			textColor="text-white"
			description="Enroll in a class to experience consistent learning from the comfort of your home."
			imageUrl="/images/marketplace/marketplace-explore.png"
			:searchQuery="searchQuery"
			@handleSearch="fetchClasses" />
		<!-- Hero -->
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

		<div
			class="mdlg:w-[85%] lg:w-[75%] w-full grid grid-cols-2 md:grid-cols-3 mdlg:grid-cols-4 lg:grid-cols-5 min-h-full gap-3 mdlg:gap-6 px-4">
			<ClassCard
				v-for="classItem in classes"
				:key="classItem.id"
				class="col-span-1 !w-auto"
				wrapped
				hasBookmark
				:classInst="classItem" />
		</div>
	</ExpandedLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'
import HeroSection from '../../components/marketplace/HeroSection.vue'
import { useExploreClasses } from '@app/composables/organizations/classes-list'

export default defineComponent({
	name: 'MarketplaceClassesPage',
	routeConfig: {
		middlewares: ['isAuthenticated'],
		goBackRoute: '/classes',
	},
	components: {
		HeroSection,
	},
	setup() {
		useHead({
			title: 'Explore Classes',
		})

		const { searchQuery, classes, fetchClasses } = useExploreClasses()
		return { searchQuery, classes, fetchClasses }
	},
})
</script>
