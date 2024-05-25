<template>
	<main class="w-full flex flex-col gap-20 bg-white max-w-[1800px] mx-auto">
		<header class="flex flex-col items-center justify-center">
			<HomeNavbar />
			<div class="hero w-full h-[400px] py-6 md:h-[800px] flex flex-col items-center justify-center">
				<!-- Link -->
				<div
					class="z-30 flex items-center bg-white h-[44px] rounded-[22px] w-[268px] overflow-hidden mb-[44px]"
					style="box-shadow: 0 4px 16px 0 #00000040">
					<router-link
						to="/home/features/students"
						class="w-1/2 h-full flex items-center justify-center p-5 text-[14px] md:text-[16px]">
						Students
					</router-link>
					<router-link
						to="/home/features/organizations"
						class="w-1/2 h-full flex items-center justify-center p-5 bg-purple text-white rounded-[22px] text-[14px] md:text-[16px]">
						Organizations
					</router-link>
				</div>
				<div class="w-[90%] md:w-[80%] mx-auto h-full flex flex-col items-center justify-center gap-4 md:gap-12">
					<h1 class="text-[20px] md:text-[40px] text-white text-center font-bold">Features</h1>
					<img class="mdlg:h-[533px]" src="/images/landing/features-hero-image.png" />
				</div>
			</div>
		</header>
		<MoreOnStranerd :content="content" />
		<HomeJoinUs class="w-[90%] md:w-[80%] mx-auto" />
		<HomeFooter />
	</main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IMoreOnStranerd } from '@app/components/home/MoreOnStranerd.vue'
const content = ref<IMoreOnStranerd>({
	study: {
		title: '',
		desc: '',
		heading: 'Virtual Learning',
		sub_heading: '',
		content:
			'Host your live classes using Stranerd’s technology, and enhance your teaching and overall classroom experience. Your students can pace themselves, prepare for quizzes, write exams from home or anywhere. Furthermore, virtual classes allow you to reach a wider audience, allowing for more students to benefit from your teaching.',
		link: '',
		image: '/images/landing/organization-virtual-learning.png',
		show: true,
	},
	classes: {
		title: 'Course Creation',
		heading: '',
		content:
			'Create engaging, interactive, and relevant course  materials that can be posted on the marketplace. These course materials and content can include videos, documents and quizzes, alongside clear instructions and guidelines on how to use the materials.  You can monitor user feedback and rating to adjust materials accordingly.',
		link: '',
		image: '/images/landing/live-classes.png',
	},
	place: {
		title: 'Marketplace',
		heading: '',
		content:
			"Stranerd's marketplace is a place for tutors and learning centers to share and sell educational materials. Teachers can create and upload their own educational materials, such as lesson plans, activities, and assessments, which can be purchased by students, tutors and other learning centers. These materials will be accessible to students and tutors worldwide, which is in line with our vision; to provide quality education to the underserved, and to be the ultimate resource for all educational needs.",
		link: '',
		show: true,
	},
	create: {
		title: 'Create',
		heading: 'Quizzes, Courses, Games, Flashcards.',
		content:
			'From interactive quizzes that test your knowledge to expertly curated courses that guide your learning, from engaging games that make studying fun to customizable flashcards that reinforce key concepts – our platform offers a diverse range of resources designed to cater to every learning style and preference.',
		link: '',
		show: false,
	},
	access: {
		title: 'Access Preparatory Classes for top examinations',
		heading: '',
		content: 'Access a world of interactive learning with quizzes and courses created ',
		link: '',
		show: false,
	},
	personalizedLearning: {
		title: '',
		content: '',
		show: false,
		link: '',
	},
	featureIdeas: {
		title: 'Accountability',
		content:
			'Stranerd enables you to monitor student performance in real time, which helps you in providing personalized feedback and support, and to track their progress over time. This helps to implement more effective instructions and creates a sense of ownership and responsibility among students, and encourages them to strive for better results.',
		image: '/images/landing/accountability-chart.png',
		mobileImage: '/images/landing/accountability-chart-top.png',
		link: '',
		show: true,
	},
	wideAudience: {
		show: false,
	},
	discoverStudyMaterials: {
		show: false,
	},
	accountability: {
		show: false,
	},
	testimonial: {
		show: true,
	},
	learningCenters: {
		show: false,
	},
	faqs: {
		show: false,
	},
	getApp: {
		show: false,
	},
	discover: {
		show: false,
	},
})
</script>
<style scoped>
.hero {
	background: url('/images/landing/layer.png'), linear-gradient(rgba(150, 77, 222, 1), rgba(150, 77, 222, 1), rgba(150, 77, 222, 1));
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
}
</style>
