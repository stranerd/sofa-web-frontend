<template>
	<div v-if="classes.length === 0" class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
		<div class="bg-lightGray flex flex-col items-center justify-center gap-2 p-4 md:p-6 rounded-custom">
			<img :src="emptyClassContent.imageURL" class="w-[59px] h-[64px]" />
			<SofaHeaderText>{{ emptyClassContent.title }}</SofaHeaderText>
			<SofaNormalText color="text-grayColor" :content="emptyClassContent.content" />
		</div>
	</div>
	<div v-else class="flex flex-col gap-4">
		<ClassCard v-for="cl in classes" :key="cl.id" :class-obj="cl" :is-wrapped="false">
			<div class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
				<sofa-icon name="share-gray" custom-class="h-[16px]" />
			</div>
		</ClassCard>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SofaHeaderText, SofaIcon, SofaNormalText } from 'sofa-ui-components'
import ClassCard from './ClassCard.vue'

export default defineComponent({
	name: 'OrganizationClassesPage',
	components: { SofaHeaderText, SofaNormalText, SofaIcon, ClassCard },
	setup() {
		const emptyClassContent = {
			imageURL: '/images/empty-class.png',
			title: 'You are not in any class',
			content: 'Contact your organization to add you to a class.',
		}

		const classes = [
			{
				id: 1,
				image: '/images/waec-exam.png',
				title: 'WAEC EXAM',
				course: 'English | Literature',
				no_of_students: '128 students',
			},
			{
				id: 2,
				image: '/images/chemistry.png',
				title: 'WAEC EXAM',
				course: 'English | Literature',
				no_of_students: '128 students',
			},
			{
				id: 3,
				image: '/images/waec.png',
				title: 'WAEC EXAM',
				course: 'English | Literature',
				no_of_students: '128 students',
			},
			{
				id: 4,
				image: '/images/pendulum.png',
				title: 'WAEC EXAM',
				course: 'English | Literature',
				no_of_students: '128 students',
			},
			{
				id: 5,
				image: '/images/physics.png',
				title: 'WAEC EXAM',
				course: 'English | Literature',
				no_of_students: '128 students',
			},
		]

		return {
			emptyClassContent,
			classes,
		}
	},
})
</script>
