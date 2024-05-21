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
	},
	classes: {
		title: 'Classes',
		heading: 'Self Paced & Live Classes',
		content:
			'Learn on Your Own Time or Dive into Real-Time Interaction. Seize control of your learning journey: embrace the tranquility of self-paced study or immerse yourself in the energy of live classes. Learn on Your Own Time or Dive into Real-Time Interaction. Seize control of your learning journey: embrace the tranquility of self-paced study or immerse yourself in the energy of live classes. merse yourself in the energ',
		link: '',
	},
	place: {
		title: 'Marketplace',
		heading: 'Explore & Discover materials',
		content:
			"Welcome to a vibrant ecosystem where learning flourishes and possibilities abound. Our Learning Marketplace is more than just a platform—it's a community of passionate learners, dedicated educators, and cutting-edge resources. Welcome to a vibrant ecosystem where learning flourishes and possibilities abound. Our Learning Marketplace is more than just a platform—it's a community of passionate learners, dedicated educators, and cutting-edge resources.",
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
	},
	wideAudience: {
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
