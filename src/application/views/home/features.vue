<template>
	<main class="w-full flex flex-col gap-20 bg-white max-w-[1800px] mx-auto">
		<header class="flex flex-col items-center justify-center">
			<HomeNavbar />
			<div class="hero w-full h-[400px] py-6 md:h-[800px] flex flex-col items-center justify-center">
				<div class="w-[90%] md:w-[80%] mx-auto h-full flex flex-col items-center justify-center gap-4 md:gap-12">
					<h1 class="text-[20px] md:text-[40px] text-white text-center font-bold">Features</h1>
					<img class="mdlg:h-[533px]" src="/images/features-hero-image.png" />
				</div>
			</div>
		</header>
		<MoreOnStranerd :content="content" />
		<HomeJoinUs class="w-[90%] md:w-[80%] mx-auto" />
		<HomeFooter />
	</main>
</template>

<script setup>
import { ref } from 'vue'
const content = ref({
	study: {
		title: '',
		desc: '',
		heading: 'Hybrid tutoring',
		sub_heading: 'AI + Human Experts',
		content: 'Elevate your learning experience with the synergy of AI technology and the insight of seasoned educators.',
		link: '#',
	},
	classes: {
		title: 'Classes',
		heading: 'Self Paced & Live Classes',
		content:
			'Learn on Your Own Time or Dive into Real-Time Interaction. Seize control of your learning journey: embrace the tranquility of self-paced study or immerse yourself in the energy of live classes.',
		link: '#',
	},
	place: {
		title: 'Marketplace',
		heading: 'Explore & Discover materials',
		content:
			"Welcome to a vibrant ecosystem where learning flourishes and possibilities abound. Our Learning Marketplace is more than just a platform—it's a community of passionate learners, dedicated educators, and cutting-edge resources.",
		link: '#',
	},
	showTestimonial: true,
	showLearningCenters: false,
	showFAQs: false,
	showCreate: true,
	showGetApp: false,
	showAccess: false,
	showDiscover: false,
})
</script>

<style scoped>
.hero {
	background: url('/images/layer.png'), linear-gradient(rgba(150, 77, 222, 1), rgba(150, 77, 222, 1), rgba(150, 77, 222, 1));
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
}
</style>
