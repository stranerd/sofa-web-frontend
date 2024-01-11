<template>
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
					@click="showCreateAndEditClassModal = true">
					Create a class
				</SofaButton>
			</div>
		</div>
	</div>
	<div v-else class="flex flex-col gap-4">
		<div class="flex items-center justify-between">
			<div
				class="bg-white w-[60%] mdlg:w-[40%] px-4 py-3 rounded-[24px] flex flex-row items-center gap-2 border border-darkLightGray">
				<sofa-icon :custom-class="'h-[15px]'" :name="'search'"></sofa-icon>
				<sofa-text-field
					v-model="searchQuery"
					custom-class="bg-transparent text-bodyBlack w-full focus:outline-none rounded-full"
					placeholder="Search"
					padding="px-1" />
			</div>
			<SofaButton :bg-color="'bg-primaryBlue'" :text-color="'text-white'" :padding="'py-3 px-4'" @click="openCreateClassModal">
				Create a class
			</SofaButton>
		</div>
		<ClassCard v-for="cl in classes" :key="cl.id" :class-obj="cl" :is-wrapped="false" :type="'org'">
			<div class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
				<sofa-icon name="more-options-horizontal" custom-class="h-[6px]" @click.stop="showMoreOptionHandler(cl)" />
			</div>
		</ClassCard>
		<!-- Options modal -->
		<sofa-modal v-if="showMoreOptions" :close="() => (showMoreOptions = false)">
			<div class="mdlg:w-[300px] mdlg:!h-full w-full h-auto flex flex-col items-center relative">
				<div class="bg-white w-full flex flex-col md:!rounded-[16px] rounded-t-2xl">
					<div
						class="w-full flex justify-between items-center sticky top-0 left-0 md:!hidden py-2 px-4 border-lightGray border-b">
						<sofa-normal-text :custom-class="'!font-bold !text-base'">Options</sofa-normal-text>
						<sofa-icon :custom-class="'h-[19px]'" :name="'circle-close'" @click="showMoreOptions = false" />
					</div>

					<a
						v-for="item in moreOptions"
						:key="item.title"
						class="w-full flex items-center gap-2 p-4"
						@click.stop.prevent="item.action()">
						<sofa-icon
							:name="item.icon"
							:class="item.icon === 'delete-quiz' ? 'fill-primaryRed h-[18px]' : 'h-[15px]'" />
						<sofa-normal-text :custom-class="item.icon === 'delete-quiz' ? '!text-primaryRed' : ''">
							{{ item.title }}
						</sofa-normal-text>
					</a>
				</div>
			</div>
		</sofa-modal>
	</div>
	<CreateAndEditClass v-if="showCreateAndEditClassModal" @close="showCreateAndEditClassModal = false" :selected-class="selectedClass" :is-edit="isEdit" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { SofaHeaderText, SofaNormalText, SofaButton, SofaIcon, SofaTextField, SofaModal } from 'sofa-ui-components'
import CreateAndEditClass from './CreateAndEditClass.vue'
import ClassCard from './ClassCard.vue'
import { useMyClasses, showMoreOptionHandler, moreOptions, showMoreOptions, showCreateAndEditClassModal, selectedClass, isEdit } from '@/composables/organizations/classes'

export default defineComponent({
	name: 'OrganizationClassesPage',
	components: { SofaHeaderText, SofaNormalText, SofaButton, SofaIcon, CreateAndEditClass, ClassCard, SofaTextField, SofaModal },
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

		const { classes } = useMyClasses()
		const searchQuery = ref('')

		const openCreateClassModal = () => {
			showCreateAndEditClassModal.value = true
			isEdit.value = false
		}

		return {
			emptyClassContent,
			classes,
			showCreateAndEditClassModal,
			searchQuery,
			showMoreOptionHandler,
			showMoreOptions,
			moreOptions,
			selectedClass,
			isEdit,
			openCreateClassModal
		}
	},
})
</script>
