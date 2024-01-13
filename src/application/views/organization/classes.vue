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
						<div v-for="(content, index) in emptyClassContent.contents" :key="index" class="flex items-center gap-1">
							<SofaIcon :custom-class="'h-[16px]'" :name="'checkmark-circle'" />
							<SofaNormalText :content="content" color="text-grayColor" />
						</div>
					</div>
					<SofaButton :bg-color="'bg-primaryBlue'" :text-color="'text-white'" :padding="'py-4 px-6'" @click="createClass">
						Create a class
					</SofaButton>
				</div>
			</div>
		</div>
		<div v-else class="flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<div
					class="bg-white w-[60%] mdlg:w-[50%] px-4 py-3 rounded-[24px] flex flex-row items-center gap-2 border border-darkLightGray">
					<sofa-icon :custom-class="'h-[15px]'" :name="'search'"></sofa-icon>
					<sofa-text-field
						v-model="searchQuery"
						custom-class="bg-transparent text-bodyBlack w-full focus:outline-none rounded-full"
						placeholder="Search"
						padding="px-1" />
				</div>
				<SofaButton :bg-color="'bg-primaryBlue'" :text-color="'text-white'" :padding="'py-3 px-4'" @click="createClass">
					Create a class
				</SofaButton>
			</div>
			<ClassCard v-for="cl in filteredClassess" :key="cl.id" :class-obj="cl" />
		</div>
	</HomeLayout>
</template>

<script lang="ts">
import HomeLayout from '@/components/home/HomeLayout.vue'
import ClassCard from '@/components/organizations/classes/ClassCard.vue'
import { useAuth } from '@/composables/auth/auth'
import { useOrganizationModal } from '@/composables/core/modals'
import { useMyClasses } from '@/composables/organizations/classes'
import { generateMiddlewares } from '@/middlewares'
import { SofaButton, SofaHeaderText, SofaIcon, SofaNormalText, SofaTextField } from 'sofa-ui-components'
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'OrganizationClassesPage',
	components: {
		HomeLayout,
		SofaHeaderText,
		SofaNormalText,
		SofaButton,
		SofaIcon,
		ClassCard,
		SofaTextField,
	},
	middlewares: { goBackRoute: '/' },
	beforeRouteEnter: generateMiddlewares(['isOrg']),
	setup() {
		const emptyClassContent = {
			imageURL: '/images/empty-class.png',
			title: 'Getting started with classes',
			contents: [
				'Teach all subjects of a class in the same place.',
				'Create lessons for specific subjects.',
				'Make announcements to all student at once.',
				'Set a monthly subscription fee for online students.',
			],
		}

		const { id: organizationId } = useAuth()
		const { classes } = useMyClasses()
		const searchQuery = ref('')

		const filteredClassess = computed(() => {
			if (searchQuery.value) return classes.value.filter((c) => c.search(searchQuery.value))
			else return classes.value
		})

		const createClass = () => useOrganizationModal().createClass.open({ organizationId: organizationId.value })

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
