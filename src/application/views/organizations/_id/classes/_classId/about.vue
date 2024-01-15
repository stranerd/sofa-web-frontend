<template>
	<ClassLayout title="Waec Class">
		<div class="w-full mdlg:bg-white mdlg:rounded-2xl mdlg:shadow-custom">
			<SofaHeaderText customClass="p-4 hidden mdlg:block">{{ 'About' }}</SofaHeaderText>
			<div class="hidden h-[1px] w-full bg-lightGray mdlg:block" />
			<div class="flex flex-col gap-4 p-0 mdlg:p-4">
				<SofaImageLoader
					customClass="block mdlg:hidden w-full h-[233px] flex items-center justify-center relative bg-grayColor rounded-custom !object-contain"
					photoUrl="/images/waec-exam.png">
				</SofaImageLoader>
				<div
					v-for="(content, index) in contents"
					:key="index"
					class="flex flex-col gap-2 bg-white rounded-2xl shadow-custom p-4 mdlg:bg-transparent mdlg:rounded-none mdlg:shadow-none mdlg:p-0">
					<SofaNormalText customClass="text-grayColor">{{ content.title }}</SofaNormalText>
					<SofaNormalText customClass="font-bold">{{ content.content }}</SofaNormalText>
				</div>
			</div>
		</div>
	</ClassLayout>
</template>

<script setup lang="ts">
import ClassLayout from '@app/components/class/ClassLayout.vue'

const contents = [
	{
		title: 'Name',
		content: 'Waec Class',
	},
	{
		title: 'Description',
		content:
			'Welcome to our Online JAMB Class, a virtual learning platform tailored to equip students with the skills and knowledge needed to excel in the Joint Admissions and Matriculations Board (JAMB) examination. Our interactive online classes, accessible at your convenience, cover all JAMB exam subjects. With flexible scheduling, practice tests, a comprehensive resource library, dedicated support, and performance analytics, we provide a holistic approach to exam preparation. Join our online community of aspirants, and let us guide you toward success in the JAMB examination.',
	},
	{
		title: 'Created',
		content: 'Dec 2, 2023',
	},
	{
		title: 'Lessons',
		content: '30',
	},
	{
		title: 'Students',
		content: '30',
	},
]
</script>
