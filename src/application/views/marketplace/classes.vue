<template>
	<ExpandedLayout>
		<div class="w-full mdlg:flex hidden flex-col py-12 bg-primaryPurple text-white justify-center items-center">
			<SofaHeading size="title" content="All classes are created by verified organizations" />

			<SofaText class="w-[48%] text-center flex items-center justify-center">
				Enroll in a class to experience consistent learning from the comfort of your home
			</SofaText>

			<form class="w-[40%] mt-6" @submit.prevent="fetchClasses">
				<SofaInput v-model="searchQuery" class="w-full !bg-white !rounded-custom shadow-custom" placeholder="Search">
					<template #prefix>
						<SofaIcon name="search-black" class="h-[17px]" @click="fetchClasses" />
					</template>
				</SofaInput>
			</form>
		</div>

		<form class="w-full flex mdlg:hidden flex-col px-4" @submit.prevent="fetchClasses">
			<div class="w-full flex items-center gap-3 z-50 justify-between bg-lightGray py-4 sticky top-0 left-0">
				<SofaIcon class="h-[15px]" name="arrow-left" @click="$utils.goBack()" />
				<SofaHeading content="Explore Classes" />
				<span class="w-4" />
			</div>
			<SofaInput v-model="searchQuery" class="flex-1 !bg-white !rounded-custom shadow-custom w-full" placeholder="Search">
				<template #prefix>
					<SofaIcon name="search-black" class="h-[15px]" @click="fetchClasses" />
				</template>
			</SofaInput>
		</form>

		<div
			class="mdlg:w-[85%] lg:w-[75%] w-full grid grid-cols-2 md:grid-cols-3 mdlg:grid-cols-4 lg:grid-cols-5 max-h-full overflow-y-auto gap-3 mdlg:gap-6 p-4">
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
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useExploreClasses } from '@app/composables/organizations/classes-list'

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
		return { searchQuery, classes, fetchClasses }
	},
})
</script>
