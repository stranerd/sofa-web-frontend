<template>
	<main class="w-full bg-white">
		<header class="flex gap-[44px] flex-col items-center justify-center bg-[#29001a] relative">
			<HomeNavbar class="!z-50" />
			<!-- Link -->
			<div
				class="z-30 flex items-center bg-white h-[44px] rounded-[22px] w-[268px] overflow-hidden"
				style="box-shadow: 0 4px 16px 0 #00000040">
				<router-link
					to="/home/students"
					class="w-1/2 h-full flex items-center justify-center p-5 rounded-[22px] text-[14px] md:text-[16px]">
					Students
				</router-link>
				<router-link
					to="/home/organizations"
					class="w-1/2 h-full flex items-center justify-center p-5 bg-purple text-white rounded-[22px] text-[14px] md:text-[16px]">
					Organizations
				</router-link>
			</div>
			<div
				class="absolute top-[65px] left-0 right-0 w-full bg-[#d500a1] rounded-b-full h-[400px] blur-[100px]"
				style="z-index: 10 !important"></div>
			<div class="z-30 w-[90%] mdlg:min-h-[400px] max-w-[1800px] relative">
				<div class="w-[90%] md:w-[70%] mdlg:w-[50%] mx-auto flex flex-col items-center justify-center text-center gap-4">
					<h1
						class="text-[18px] text-white leading-[27px] md:text-[30px] md:leading-[40px] mdlg:text-[40px] text-center font-600 mdlg:leading-[60px] font-semibold">
						Unlock Your Students Potential with Personalized
					</h1>
					<div
						class="bg-purple text-white w-[174px] text-[20px] mdlg:text-[40px] font-600 font-semibold rounded-lg h-[38px] mdlg:h-[80px] mdlg:w-[387px] flex items-center justify-center -rotate-6 mb-4">
						Infrastructure
					</div>
					<p class="text-[14px] text-white md:text-[16px] leading-[24px]">
						Empower educators, engage learners, and streamline operations with our comprehensive learning platform
					</p>
					<div class="flex flex-col md:flex-row items-center gap-3">
						<RouterLink to="/auth/signup" class="bg-white text-purple py-[10px] px-[30px] h-[44px] rounded-[22px]">
							Get started
						</RouterLink>
						<RouterLink
							to="/"
							class="flex items-center justify-center gap-[10px] border border-white text-white py-[10px] px-[30px] h-[44px] rounded-[22px]">
							<SofaIcon name="solar_play-circle-bold" class="!fill-white" />
							<span class="text-white">Watch video</span>
						</RouterLink>
					</div>
				</div>
				<img class="hidden mdlg:block absolute top-0 right-0" src="/images/landing/smiles.png" />
				<img class="hidden mdlg:block absolute -bottom-14 left-0" src="/images/landing/arrow-svg-white.png" />
			</div>
			<div class="z-30 w-[90%] max-w-[1800px] mt-[30px] mdlg:mt-0 mx-auto flex md:items-center md:justify-center">
				<img
					src="/images/landing/organization-hero-image.png"
					class="w-full h-full mdlg:h-[450px] mdlg:w-[767px] object-cover md:object-contain" />
			</div>
			<img class="z-30 w-[90%] mx-auto -mb-10 md:-mb-24 h-full" src="/images/landing/stranerd-stats.png" />
		</header>
		<MoreOnStranerd class="mt-[100px] mdlg:mt-[180px]" :content="content" />
		<HomeFooter />
	</main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IMoreOnStranerd } from '@app/components/home/MoreOnStranerd.vue'
const content = ref<IMoreOnStranerd>({
	study: {
		title: 'Exciting New Ways to Study',
		desc: 'Transform your child’s learning experience into something truly engaging and effective',
		heading: 'Personalized Learning Experience',
		sub_heading: '',
		content:
			"Tailored to your child's unique learning style and pace, our platform delivers personalized lessons and activities that keep them engaged and motivated.",
		link: '/home/features#study',
	},
	classes: {
		title: 'Real-time Progress Tracking',
		heading: '',
		content:
			"Stay informed about your child's academic progress with real-time updates and insights, allowing you to identify areas for improvement and celebrate their achievements.",
		link: '/home/features#classes',
	},
	place: {
		title: 'Expert Resources and Support',
		heading: '',
		content:
			'Access a wealth of educational resources, tips, and support from our team of experts, empowering you to provide the best possible learning environment for your child.',
		link: '/home/features#marketplace',
	},
	create: {
		title: 'Create',
		heading: 'Quizzes, Courses, Games, Flashcards.',
		content:
			'From interactive quizzes that test your knowledge to expertly curated courses that guide your learning, from engaging games that make studying fun to customizable flashcards that reinforce key concepts – our platform offers a diverse range of resources designed to cater to every learning style and preference.',
		link: '/home/features#create',
		show: false,
	},
	marketPlace: {
		title: 'Create',
		heading: 'Quizzes, Courses, Games, Flashcards.',
		content:
			'From interactive quizzes that test your knowledge to expertly curated courses that guide your learning, from engaging games that make studying fun to customizable flashcards that reinforce key concepts – our platform offers a diverse range of resources designed to cater to every learning style and preference.',
		link: '/home/features#create',
		show: false,
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
	access: {
		show: true,
	},
	discover: {
		show: true,
	},
})
</script>
