<template>
	<main class="w-full flex flex-col gap-[50px] mdlg:gap-[150px] bg-white mx-auto">
		<header class="flex flex-col items-center justify-center relative">
			<HomeNavbar class="mb-[44px]" />
			<!-- Link -->
			<div
				class="z-30 flex items-center bg-white h-[44px] rounded-[22px] w-[268px] overflow-hidden mb-[44px]"
				style="box-shadow: 0 4px 16px 0 #00000040">
				<router-link
					to="/home/students"
					class="w-1/2 h-full flex items-center justify-center p-5 bg-purple text-white rounded-[22px] text-[14px] md:text-[16px]">
					Students
				</router-link>
				<router-link to="/home/organizations" class="w-1/2 h-full flex items-center justify-center p-5 text-[14px] md:text-[16px]">
					Organizations
				</router-link>
			</div>
			<div
				class="absolute top-[1px] left-0 right-0 w-full bg-[#FFC96F] rounded-b-full h-[200px] blur-[100px]"
				style="z-index: 10 !important"></div>
			<div class="z-30 w-[90%] mdlg:min-h-[500px] max-w-[1800px] relative">
				<div class="w-[90%] md:w-[70%] mdlg:w-[50%] mx-auto flex flex-col items-center justify-center text-center gap-4">
					<h1
						class="text-[18px] leading-[27px] md:text-[30px] md:leading-[40px] mdlg:text-[40px] text-center font-600 mdlg:leading-[60px] font-semibold">
						Academic Excellence Made
					</h1>
					<div
						class="bg-purple text-white w-[174px] text-[20px] mdlg:text-[40px] font-600 font-semibold rounded-lg h-[38px] mdlg:h-[80px] mdlg:w-[387px] flex items-center justify-center -rotate-6 mb-4">
						Easy
					</div>
					<p class="text-[14px] md:text-[16px] leading-[24px]">
						Join students like you all over the world in achieving extraordinary academic success with Stranerd.
					</p>
					<div class="flex flex-col md:flex-row items-center gap-3">
						<RouterLink to="/auth/signup" class="bg-purple text-white py-[10px] px-[30px] h-[44px] rounded-[22px]">
							Get started
						</RouterLink>
						<RouterLink
							to="/"
							class="flex items-center justify-center gap-[10px] border border-purple text-purple py-[10px] px-[30px] h-[44px] rounded-[22px]">
							<SofaIcon name="solar_play-circle-bold" />
							<span class="text-purple">Watch video</span>
						</RouterLink>
					</div>
				</div>
				<img class="hidden mdlg:block absolute top-0 right-0" src="/images/landing/smiles.png" />
				<img class="hidden mdlg:block absolute bottom-0 left-0" src="/images/landing/arrow-svg.png" />
			</div>
			<div class="w-[90%] mt-[30px] mdlg:mt-0 mx-auto flex md:items-center md:justify-center">
				<img src="/images/landing/students-hero-image.png" class="w-full h-full mdlg:h-[866px] object-cover md:object-contain" />
			</div>
		</header>
		<MoreOnStranerd :content="content" />
		<HomeFooter />
	</main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IMoreOnStranerd } from '@app/components/home/MoreOnStranerd.vue'
const content = ref<IMoreOnStranerd>({
	study: {
		title: 'Stranerd for Students',
		desc: 'Guiding thousands of students on their journey to academic excellence.',
		heading: 'Hybrid tutoring',
		sub_heading: 'AI + Human Experts',
		content: 'Elevate your learning experience by utilizing the power of AI technology and educators Insights.',
		image: '/images/landing/bot+human.png',
		link: '/home/features#study',
		show: true,
	},
	classes: {
		title: 'Classes',
		heading: '',
		content: 'Watch live classes, and catch the replay at your convenient time.',
		image: '/images/landing/live-classes.png',
		link: '/home/features#classes',
	},
	place: {
		title: 'Marketplace',
		heading: '',
		content: 'Explore extensive and resourceful materials needed for academic success.',
		link: '/home/features#marketplace',
		show: true,
	},
	create: {
		title: 'Create',
		heading: 'Quizzes, Courses, Games, Flashcards.',
		content:
			'From interactive quizzes that test your knowledge to expertly curated courses that guide your learning, from engaging games that make studying fun to customizable flashcards that reinforce key concepts – our platform offers a diverse range of resources designed to cater to every learning style and preference.',
		link: '/home/features#create',
		show: false,
	},
	access: {
		title: 'Access Preparatory Classes for top examinations',
		heading: '',
		content: 'Access a world of interactive learning with quizzes and courses created ',
		link: '',
		show: true,
	},
	personalizedLearning: {
		title: 'Personalized Learning',
		content: 'Create flashcards, mock quizzes and tests to test your knowledge on subjects.',
		image: '/images/landing/personalized-learning.png',
		mobileImage: '/images/landing/personalized-learning-top.png',
		show: true,
		link: '',
	},
	discoverStudyMaterials: {
		show: true,
	},
	testimonial: {
		show: true,
	},
	learningCenters: {
		show: true,
	},
	faqs: {
		show: true,
	},
	getApp: {
		show: true,
	},
	wideAudience: {
		show: false,
	},
	accountability: {
		show: false,
	},
	discover: {
		show: true,
	},
})
</script>
