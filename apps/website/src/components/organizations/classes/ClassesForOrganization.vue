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
				<SofaButton :bg-color="'bg-primaryBlue'" :text-color="'text-white'" :padding="'py-4 px-6'" @click="showCreateClassModal = true">
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
			<SofaButton :bg-color="'bg-primaryBlue'" :text-color="'text-white'" :padding="'py-3 px-4'" @click="showCreateClassModal = true"
				>Create a class</SofaButton
			>
		</div>
		<ClassCard v-for="cl in classes" :key="cl.id" :class-obj="cl" :is-wrapped="false" :type="'org'">
			<div class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
				<sofa-icon name="more-options-horizontal" custom-class="h-[6px]" />
			</div>
		</ClassCard>
	</div>
	<CreateClass v-if="showCreateClassModal" @close="showCreateClassModal = false" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { SofaHeaderText, SofaNormalText, SofaButton, SofaIcon, SofaTextField } from 'sofa-ui-components'
import CreateClass from './CreateClass.vue'
import ClassCard from './ClassCard.vue'

export default defineComponent({
	name: 'OrganizationClassesPage',
	components: { SofaHeaderText, SofaNormalText, SofaButton, SofaIcon, CreateClass, ClassCard, SofaTextField },
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

		const showCreateClassModal = ref(false)
		const searchQuery = ref('')
		const classes = [
			{
				id: 1,
				image: '/images/waec-exam.png',
				title: 'WAEC EXAM',
				price: 'N21,000/month',
				no_of_students: '128 students',
				no_of_lessons: '30 lessons',
			},
			{
				id: 2,
				image: '/images/chemistry.png',
				title: 'WAEC EXAM',
				price: 'N21,000/month',
				no_of_students: '128 students',
				no_of_lessons: '30 lessons',
			},
			{
				id: 3,
				image: '/images/waec.png',
				title: 'WAEC EXAM',
				price: 'N21,000/month',
				no_of_students: '128 students',
				no_of_lessons: '30 lessons',
			},
			{
				id: 4,
				image: '/images/pendulum.png',
				title: 'WAEC EXAM',
				price: 'N21,000/month',
				no_of_students: '128 students',
				no_of_lessons: '30 lessons',
			},
			{
				id: 5,
				image: '/images/physics.png',
				title: 'WAEC EXAM',
				price: 'N21,000/month',
				no_of_students: '128 students',
				no_of_lessons: '30 lessons',
			},
		]

		return {
			emptyClassContent,
			classes,
			showCreateClassModal,
			searchQuery,
		}
	},
})
</script>
