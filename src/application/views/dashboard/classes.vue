<template>
	<HomeLayout title="Classes">
		<div v-if="classes.length === 0" class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
			<div class="flex flex-col mdlg:flex-row mdlg:items-center gap-6 p-4 md:p-6 rounded-custom">
				<div class="bg-lightGray w-[241px] h-[241px] flex items-center justify-center rounded-custom">
					<img :src="emptyClassContent.imageURL" class="w-[121px] h-[144px]" />
				</div>
				<div class="flex flex-col items-start gap-1">
					<SofaHeaderText :content="emptyClassContent.title" size="xl" />
					<div class="flex flex-col gap-2 py-2">
						<div v-for="(content, index) in emptyClassContent.contents" :key="index" class="flex mdlg:items-center gap-1">
							<SofaIcon customClass="h-[16px]" name="checkmark-circle" />
							<SofaNormalText :content="content" color="text-grayColor" />
						</div>
					</div>
					<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-4 px-6" @click="createClass">
						Create a class
					</SofaButton>
				</div>
			</div>
		</div>
		<div v-else class="flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<div
					class="bg-white w-[60%] mdlg:w-[50%] px-4 py-3 rounded-[24px] flex flex-row items-center gap-2 border border-darkLightGray">
					<SofaIcon customClass="h-[15px]" name="search"></SofaIcon>
					<SofaTextField
						v-model="searchQuery"
						customClass="bg-transparent text-bodyBlack w-full focus:outline-none rounded-full"
						placeholder="Search"
						padding="px-1" />
				</div>
				<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-3 px-4" @click="createClass">
					Create a class
				</SofaButton>
			</div>
			<ClassCard v-for="cl in filteredClassess" :key="cl.id" :classInst="cl" />
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

		const createClass = () => useModals().organizations.createClass.open({ organizationId: organizationId.value })

		return {
			emptyClassContent,
			classes,
			filteredClassess,
			searchQuery,
			createClass,
		}
	},
})
</script>
