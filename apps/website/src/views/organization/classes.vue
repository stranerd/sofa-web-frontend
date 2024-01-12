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
					<SofaButton
						:bg-color="'bg-primaryBlue'"
						:text-color="'text-white'"
						:padding="'py-4 px-6'"
						@click="showCreateClassModal = true">
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
				<SofaButton
					:bg-color="'bg-primaryBlue'"
					:text-color="'text-white'"
					:padding="'py-3 px-4'"
					@click="showCreateClassModal = true">
					Create a class
				</SofaButton>
			</div>
			<ClassCard v-for="cl in filteredClassess" :key="cl.id" :class-obj="cl">
				<div class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
					<sofa-icon name="more-options-horizontal" class="h-[6px]" @click.stop="showMoreOptionHandler(cl)" />
				</div>
			</ClassCard>
			<!-- Options modal -->
			<sofa-modal v-if="showMoreOptions" :close="() => (showMoreOptions = false)">
				<div class="mdlg:w-[300px] mdlg:!h-full w-full h-auto flex flex-col items-center relative">
					<div class="bg-white w-full flex flex-col md:!rounded-[16px] rounded-t-2xl">
						<div
							class="w-full flex justify-between items-center sticky top-0 left-0 md:hidden py-2 px-4 border-lightGray border-b">
							<sofa-normal-text :custom-class="'!font-bold !text-base'">Options</sofa-normal-text>
							<sofa-icon :custom-class="'h-[19px]'" :name="'circle-close'" @click="showMoreOptions = false" />
						</div>

						<a
							v-for="item in moreOptions"
							:key="item.title"
							class="w-full flex items-center gap-2 p-4"
							@click.stop.prevent="item.action()">
							<sofa-icon :name="item.icon" :class="item.icon === 'delete-quiz' ? 'fill-primaryRed h-[18px]' : 'h-[15px]'" />
							<sofa-normal-text :custom-class="item.icon === 'delete-quiz' ? '!text-primaryRed' : ''">
								{{ item.title }}
							</sofa-normal-text>
						</a>
					</div>
				</div>
			</sofa-modal>
		</div>
		<CreateClassModal v-if="showCreateClassModal" :organization-id="id" @close="showCreateClassModal = false" />
		<EditClassModal v-if="showEditClassModal" :organization-id="id" @close="showEditClassModal = false" />
	</HomeLayout>
</template>

<script lang="ts">
import HomeLayout from '@/components/home/HomeLayout.vue'
import ClassCard from '@/components/organizations/classes/ClassCard.vue'
import CreateClassModal from '@/components/organizations/classes/CreateClassModal.vue'
import EditClassModal from '@/components/organizations/classes/EditClassModal.vue'
import { useAuth } from '@/composables/auth/auth'
import {
	selectedClass,
	showCreateClassModal,
	showEditClassModal,
	showMoreOptionHandler,
	showMoreOptions,
	useMyClasses,
} from '@/composables/organizations/classes'
import { generateMiddlewares } from '@/middlewares'
import { SofaButton, SofaHeaderText, SofaIcon, SofaModal, SofaNormalText, SofaTextField } from 'sofa-ui-components'
import { defineComponent, ref, computed } from 'vue'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'OrganizationClassesPage',
	components: {
		HomeLayout,
		SofaHeaderText,
		SofaNormalText,
		SofaButton,
		SofaIcon,
		CreateClassModal,
		ClassCard,
		SofaTextField,
		SofaModal,
		EditClassModal,
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

		const { id } = useAuth()
		const { classes, deleteClass } = useMyClasses()
		const searchQuery = ref('')

		const filteredClassess = computed(()=>{
			if(searchQuery.value){
				return classes.value.filter((c) => c.search(searchQuery.value) )
			} else {
				return classes.value
			}
		})

		const moreOptions = [
			{
				icon: 'edit-option',
				title: 'Edit',
				action: () => {
					showEditClassModal.value = true
					showMoreOptions.value = false
				},
			},
			{
				icon: 'share-option',
				title: 'Share',
				action: () => {
					const baseUrl = window.location.href
					Logic.Common.share('Join class on SOFA', `Join ${selectedClass.value.title} class on SOFA`, `${baseUrl}/${selectedClass.value.id}`)
					showMoreOptions.value = false
				},
			},
			{
				icon: 'delete-quiz',
				title: 'Delete',
				action: async () => {
					await deleteClass(selectedClass.value)
					showMoreOptions.value = false
				},
			},
		]

		return {
			id,
			emptyClassContent,
			classes,
			showCreateClassModal,
			showEditClassModal,
			searchQuery,
			showMoreOptionHandler,
			showMoreOptions,
			moreOptions,
			filteredClassess
		}
	},
})
</script>
