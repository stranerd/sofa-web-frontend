<template>
	<HomeLayout title="Classes">
		<div v-if="classes.length === 0" class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4">
			<div class="flex items-center justify-between bg-white rounded-custom px-4 mdlg:px-6 pt-3">
				<div class="w-full mdlg:w-1/2 hidden mdlg:flex items-center gap-2">
					<SofaIcon name="back-arrow" class="!fill-grayColor" />
					<p class="flex items-center gap-1"><span class="text-grayColor">Home / </span> Classes</p>
				</div>
				<div class="w-full mdlg:w-1/2 justify-self-end flex items-center gap-2">
					<div
						class="bg-white w-full mdlg:w-[70%] px-4 py-3 rounded-lg flex flex-row items-center gap-2 border border-darkLightGray">
						<SofaIcon customClass="h-[15px]" name="search"></SofaIcon>
						<SofaTextField
							v-model="searchQuery"
							customClass="bg-transparent text-bodyBlack w-full focus:outline-none rounded-lg"
							placeholder="Search"
							padding="px-1" />
					</div>
					<QuickActions :buttons="quickActionsOptions" />
				</div>
			</div>
			<div class="h-[1px] w-full bg-lightGray"></div>
			<div class="py-10 flex items-center justify-center px-4 mdlg:px-6">
				<SofaEmptyStateNew
					title="Getting started with classes"
					:contents="[
						'Teach all subjects of a class in the same place',
						'Create subjects for specific subjects',
						'Create subjects for specific subjects',
						'Set a monthly subscription fee for online students',
					]"
					imageUrl="/images/classes.png"
					:firstButton="classesEmptyStateButtonConfig.firstButton" />
			</div>
		</div>
		<div v-else class="flex flex-col gap-4">
			<div class="flex items-center justify-between bg-white rounded-custom px-4 py-2">
				<div class="w-full mdlg:w-[40%] hidden mdlg:flex items-center gap-2">
					<SofaIcon name="back-arrow" class="!fill-grayColor" />
					<p class="flex items-center gap-1"><span class="text-grayColor">Home / </span> Classes</p>
				</div>
				<div class="w-full mdlg:w-[60%] justify-self-end flex items-center gap-2">
					<div
						class="bg-white w-full mdlg:w-[50%] px-4 py-3 rounded-lg flex flex-row items-center gap-2 border border-darkLightGray">
						<SofaIcon customClass="h-[15px]" name="search"></SofaIcon>
						<SofaTextField
							v-model="searchQuery"
							customClass="bg-transparent text-bodyBlack w-full focus:outline-none rounded-lg"
							placeholder="Search"
							padding="px-1" />
					</div>
					<QuickActions :buttons="quickActionsOptions" />
					<SofaButton
						v-if="classes.length"
						bgColor="bg-primaryBlue"
						textColor="text-white"
						padding="py-3 px-4"
						customClass="hidden mdlg:block"
						@click="createClass">
						Create a class
					</SofaButton>
				</div>
			</div>
			<div class="grid grid-cols-1 mdlg:grid-cols-2 gap-6">
				<ClassCard v-for="cl in filteredClassess" :key="cl.id" :classInst="cl" class="bg-white" />
			</div>
		</div>
	</HomeLayout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import HomeLayout from '@app/components/home/HomeLayout.vue'
import ClassCard from '@app/components/organizations/classes/ClassCard.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { useOrganizationClasses } from '@app/composables/organizations/classes'

export default defineComponent({
	name: 'OrganizationClassesPage',
	components: { HomeLayout, ClassCard },
	routeConfig: { goBackRoute: '/dashboard', middlewares: ['isOrg'] },
	setup() {
		const emptyClassContent = {
			imageURL: '/images/empty-classes.png',
			title: 'Getting started with classes',
			contents: [
				'Teach all subjects of a class in the same place.',
				'Create lessons for specific subjects.',
				'Make announcements to all student at once.',
				'Set a monthly subscription fee for online students.',
			],
		}

		const { id: organizationId } = useAuth()
		const { classes } = useOrganizationClasses(organizationId.value)
		const searchQuery = ref('')

		const filteredClassess = computed(() => {
			if (searchQuery.value) return classes.value.filter((c) => c.search(searchQuery.value))
			else return classes.value
		})

		const classesEmptyStateButtonConfig = computed(() => ({
			firstButton: {
				label: 'Create a class',
				action: () => {
					createClass()
				},
			},
		}))

		const createClass = () => useModals().organizations.createClass.open({ organizationId: organizationId.value })

		const quickActionsOptions = ref([
			{
				label: 'Add a student',
				action: () => {},
			},
			{
				label: 'Add a teacher',
				action: () => {},
			},
			{
				label: 'Create a quiz',
				action: () => {},
			},
			{
				label: 'Create a course',
				action: () => {},
			},
			{
				label: 'Create a class',
				action: () => {},
			},
			{
				label: 'Create a subject',
				action: () => {},
			},
		])

		return {
			emptyClassContent,
			classes,
			filteredClassess,
			searchQuery,
			createClass,
			classesEmptyStateButtonConfig,
			quickActionsOptions,
		}
	},
})
</script>
