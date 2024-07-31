<template>
	<h3 class="text-purple font-bold text-[25px] md:text-[36px] md:leading-[54px] text-center capitalize">Resources by subjects</h3>
	<div class="w-full mx-auto p-8 my-10 relative max-w-[1800px] bg-blue-100">
		<div class="grid grid-cols-1 md:grid-cols-3 place-items-center gap-4 w-full">
			<div v-for="(subject, index) in content" :key="index" class="w-full md:w-[400px] min-h-[180px] max-h-[340px] p-4 space-y-4">
				<h4 class="font-bold text-[18px] md:text-[20px]">{{ subject.title }}</h4>
				<div class="flex flex-wrap">
					<p v-for="(link, id) in subject.links" :key="id" class="text-[12px] md:text-[15px] mr-2 text-[#6565FF]">
						{{ link.title }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Link {
	title: string
	link: string
}

interface Subjects {
	image: string
	title: string
	links: Link[]
}

const content = ref<Subjects[]>([
	{
		image: '',
		title: 'Management Sciences',
		links: [
			{ title: 'Accounting', link: '#' },
			{ title: 'Hospitality Management and Tourism Management', link: '#' },
			{ title: 'Marketing', link: '#' },
			{ title: 'Acturial Science & Insurance', link: '#' },
			{ title: 'Banking & Finance', link: '#' },
			{ title: 'Business Administration', link: '#' },
			{ title: 'Industrial Relations & Personnnel Management', link: '#' },
		],
	},
	{
		image: '',
		title: 'Environmental Sciences',
		links: [
			{ title: 'Architecture', link: '#' },
			{ title: 'Building', link: '#' },
			{ title: 'Estate Management', link: '#' },
			{ title: 'Quantity Surveying', link: '#' },
			{ title: 'Urban & Regional Planning', link: '#' },
		],
	},
	{
		image: '',
		title: 'Education',
		links: [{ title: 'Adult Education', link: '#' }],
	},
	{
		image: '',
		title: 'Arts',
		links: [
			{ title: 'Classic', link: '#' },
			{ title: 'Music', link: '#' },
		],
	},
	{
		image: '',
		title: 'Sciences',
		links: [
			{ title: 'Biochemistry', link: '#' },
			{ title: 'Biology', link: '#' },
			{ title: 'Chemistry', link: '#' },
			{ title: 'Computer Science', link: '#' },
			{ title: 'Geology', link: '#' },
			{ title: 'Physics', link: '#' },
			{ title: 'Statistics', link: '#' },
			{ title: 'Zoology', link: '#' },
		],
	},
	{
		image: '',
		title: 'Social Sciences',
		links: [
			{ title: 'Economics', link: '#' },
			{ title: 'Geography', link: '#' },
			{ title: 'Political Science', link: '#' },
			{ title: 'Psychology', link: '#' },
			{ title: 'Sociology', link: '#' },
			{ title: 'Social Work', link: '#' },
			{ title: 'Mass Communication', link: '#' },
		],
	},
	{
		image: '',
		title: 'Agriculture',
		links: [
			{ title: 'Agricultural economics', link: '#' },
			{ title: 'Agricultural Extension', link: '#' },
			{ title: 'Animal Science', link: '#' },
			{ title: 'Crop Science', link: '#' },
			{ title: 'Soil Science', link: '#' },
			{ title: 'Fisheries & Aquaculture', link: '#' },
			{ title: 'Forestry & Wildlife Management', link: '#' },
		],
	},
	{
		image: '',
		title: 'Clinical Sciences',
		links: [
			{ title: 'Anathesia', link: '#' },
			{ title: 'Medicine', link: '#' },
			{ title: 'Nursing', link: '#' },
			{ title: 'Physiotherapy', link: '#' },
			{ title: 'Radiography', link: '#' },
			{ title: 'Medical Laboratory Science', link: '#' },
		],
	},
	{
		image: '',
		title: 'Dental Sciences',
		links: [
			{ title: 'Clinical Dentistry', link: '#' },
			{ title: 'Oral Health', link: '#' },
			{ title: 'Orthodontics', link: '#' },
			{ title: 'Oral Pathology', link: '#' },
			{ title: 'Oral Surgery', link: '#' },
			{ title: 'Periodontology', link: '#' },
		],
	},
	{
		image: '',
		title: 'Medical Sciences',
		links: [{ title: 'Anatomy', link: '#' }],
	},
	{
		image: '',
		title: 'Pharmacy',
		links: [
			{ title: 'Pharmaceutical Sciences', link: '#' },
			{ title: 'Pharmacy Technology', link: '#' },
			{ title: 'Pharmacy Administration', link: '#' },
			{ title: 'Pharmacy Practice', link: '#' },
		],
	},
	{
		image: '',
		title: 'Maths',
		links: [
			{ title: 'Algebra', link: '#' },
			{ title: 'Calculus', link: '#' },
			{ title: 'Geometry', link: '#' },
			{ title: 'Trigonometry', link: '#' },
			{ title: 'Statistics', link: '#' },
			{ title: 'Probability', link: '#' },
			{ title: 'Differential Equations', link: '#' },
		],
	},
	{
		image: '',
		title: 'Engineering',
		links: [
			{ title: 'Biomedical Engineering', link: '#' },
			{ title: 'Chemical Engineering', link: '#' },
			{ title: 'Civil Engineering', link: '#' },
			{ title: 'Computer Engineering', link: '#' },
			{ title: 'Electrical Engineering', link: '#' },
			{ title: 'Mechanical Engineering', link: '#' },
			{ title: 'Petroleum Engineering', link: '#' },
		],
	},
	{
		image: '',
		title: 'Law',
		links: [
			{ title: 'International Law', link: '#' },
			{ title: 'Public Law', link: '#' },
			{ title: 'Private Law', link: '#' },
			{ title: 'Islamic Law', link: '#' },
			{ title: 'Customary Law', link: '#' },
		],
	},
])
</script>
