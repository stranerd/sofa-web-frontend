<template>
	<main class="w-full flex flex-col gap-[50px] mdlg:gap-[150px] bg-white mx-auto">
		<header class="flex flex-col items-center justify-center relative">
			<HomeNavbar class="mb-[44px] z-50" />
			<!-- Link -->
			<div
				class="flex items-center bg-white h-[44px] rounded-[22px] w-[268px] overflow-hidden mb-[44px]"
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
			<div class="w-[90%] mdlg:min-h-[500px] max-w-[1800px] relative">
				<div class="w-[90%] md:w-[70%] mdlg:w-[50%] mx-auto flex flex-col items-center justify-center text-center gap-4">
					<h1
						class="text-[18px] leading-[27px] md:text-[30px] md:leading-[40px] mdlg:text-[40px] text-center font-600 mdlg:leading-[60px] font-semibold">
						Transforming Learning Centers with Our Cutting-Edge
					</h1>
					<div
						class="bg-purple text-white w-[174px] text-[20px] mdlg:text-[40px] font-600 font-semibold rounded-lg h-[38px] mdlg:h-[80px] mdlg:w-[387px] flex items-center justify-center -rotate-6 mb-4">
						Infrastructure
					</div>
					<p class="text-[14px] md:text-[16px] leading-[24px]">
						Empower educators, engage learners, and streamline operations with our comprehensive learning platform
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
				<img class="hidden mdlg:block absolute top-0 right-0" src="/images/smiles.png" />
				<img class="hidden mdlg:block absolute bottom-0 left-0" src="/images/arrow-svg.png" />
			</div>
			<div class="w-[90%] mt-[30px] mdlg:mt-0 mx-auto flex md:items-center md:justify-center">
				<img src="/images/students-hero-image.png" class="w-full h-full mdlg:h-[866px] object-cover md:object-contain" />
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
		title: 'Exciting New Ways to Study',
		desc: 'Making learning experiences engaging and effective',
		heading: 'Hybrid tutoring',
		sub_heading: 'AI + Human Experts',
		content: 'Elevate your learning experience with the synergy of AI technology and the insight of seasoned educators.',
		link: '/home/features#study',
	},
	classes: {
		title: 'Classes',
		heading: 'Self Paced & Live Classes',
		content:
			'Learn on Your Own Time or Dive into Real-Time Interaction. Seize control of your learning journey: embrace the tranquility of self-paced study or immerse yourself in the energy of live classes.',
		link: '/home/features#classes',
	},
	place: {
		title: 'Marketplace',
		heading: 'Explore & Discover materials',
		content:
			"Welcome to a vibrant ecosystem where learning flourishes and possibilities abound. Our Learning Marketplace is more than just a platform—it's a community of passionate learners, dedicated educators, and cutting-edge resources.",
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
