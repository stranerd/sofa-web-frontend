<template>
	<main class="w-full flex flex-col gap-20 bg-white max-w-[1800px] mx-auto">
		<header class="flex flex-col items-center justify-center">
			<HomeNavbar />
			<div class="hero w-full h-[400px] py-6 md:h-[800px] flex flex-col items-center justify-center">
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
		heading: 'Hybrid tutoring',
		sub_heading: 'AI + Human Experts',
		content:
			'Elevate your learning experience with the synergy of AI technology and the insight of seasoned educators. Elevate your learning experience with the synergy of AI technology and the insight of seasoned educators. Elevate your learning experience with the synergy of AI technology and the insight of seasoned educators. Elevate your learning experience with the synergy of AI technology and the insight of seasoned educators.',
		link: '',
		image: '/images/landing/bot+human.png',
	},
	classes: {
		title: 'Classes',
		heading: '',
		content:
			'Join and rewatch live classes hosted by your learning centers on Stranerd. Stranerd offers you the opportunity to participate in and rewatch live classes hosted by your learning centers anywhere you are. You can access these recorded classes from any device, allowing you to study and learn at your own pace. We have made it easy for you to track your studies and stay organized with your learning.',
		link: '',
		image: '/images/landing/live-classes.png',
	},
	place: {
		title: 'Marketplace',
		heading: '',
		content:
			'Explore the endless materials and resources created just for you. Find a wide range of study guides, mock quizzes and exams, online courses to help you master any subject. By maximizing the use of these wide range of resources we have provided, your academic goals can be attained.',
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
