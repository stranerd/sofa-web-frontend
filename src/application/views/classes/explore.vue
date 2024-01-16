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

		<form class="w-full p-4 flex mdlg:hidden flex-col" @submit.prevent="fetchClasses">
			<div class="w-full shadow-custom px-4 mdlg:py-2 bg-white rounded-custom flex gap-2 items-center justify-start">
				<SofaTextField v-model="searchQuery" class="flex-1" customClass="!border-none w-full !px-0" placeholder="Search">
					<template #inner-prefix>
						<SofaIcon name="search-black" class="h-[15px]" @click="fetchClasses" />
					</template>
				</SofaTextField>
			</div>
		</form>

		<div class="mdlg:w-[85%] lg:w-[75%] w-full flex flex-col h-full overflow-y-auto gap-8 px-4">Classes</div>
	</ExpandedLayout>
</template>

<script lang="ts">
import { useExploreClasses } from '@app/composables/organizations/classes-explore'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'ClassesExplore',
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
