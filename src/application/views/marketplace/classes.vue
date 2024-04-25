<template>
	<ExpandedLayout layoutStyle="mdlg:pb-4">
		<div class="w-full mdlg:flex hidden flex-col pt-8 pb-12 bg-primaryPurple justify-center items-center">
			<SofaHeaderText
				color="text-white"
				size="xl"
				class="!font-extrabold"
				content="All classes are created by verified organizations" />

			<SofaNormalText color="text-white" customClass="w-[48%] text-center flex items-center justify-center">
				Enroll in a class to experience consistent learning from the comfort of your home
			</SofaNormalText>

			<form class="w-[40%] shadow-custom mt-6 bg-white rounded-custom" @submit.prevent="fetchClasses">
				<SofaTextField v-model="searchQuery" class="w-full" customClass="!border-none w-full" placeholder="Search">
					<template #inner-prefix>
						<SofaIcon name="search-black" class="h-[17px]" @click="fetchClasses" />
					</template>
				</SofaTextField>
			</form>
		</div>

		<form class="w-full flex mdlg:hidden flex-col px-4" @submit.prevent="fetchClasses">
			<div class="w-full flex items-center gap-3 z-50 justify-between bg-lightGray py-4 sticky top-0 left-0">
				<SofaIcon customClass="h-[15px]" name="back-arrow" @click="$utils.goBack()" />
				<SofaNormalText customClass="!font-bold !text-base" content="Explore Classes" />
				<span class="w-4" />
			</div>
			<SofaTextField
				v-model="searchQuery"
				class="flex-1"
				customClass="bg-white !rounded-custom shadow-custom w-full px-4 py-3"
				placeholder="Search">
				<template #inner-prefix>
					<SofaIcon name="search-black" class="h-[15px]" @click="fetchClasses" />
				</template>
			</SofaTextField>
		</form>

		<div
			class="mdlg:w-[85%] lg:w-[75%] w-full grid grid-cols-2 md:grid-cols-3 mdlg:grid-cols-4 lg:grid-cols-5 max-h-full overflow-y-auto gap-3 mdlg:gap-6 px-4 py-8 mdlg:py-12">
			<ClassCard v-for="classItem in classes" :key="classItem.id" wrapped hasBookmark :classInst="classItem" />
		</div>
	</ExpandedLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useExploreClasses } from '@app/composables/organizations/classes-explore'

export default defineComponent({
	name: 'MarketplaceClassesPage',
	routeConfig: {
		middlewares: ['isAuthenticated'],
		goBackRoute: '/classes',
	},
	setup() {
		useMeta({
			title: 'Explore Classes',
		})

		const { searchQuery, classes, fetchClasses } = useExploreClasses()

		return {
			searchQuery,
			classes,
			fetchClasses,
		}
	},
})
</script>
