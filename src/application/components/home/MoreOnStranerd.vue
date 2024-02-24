<template>
	<div class="w-full flex flex-col items-center justify-center">
		<!-- New and exciting ways to study -->
		<div class="w-full">
			<h2 class="text-[32px] text-purple font-bold leading-[54px] text-center">New and Exciting Ways to Study</h2>
			<p class="text-[16px] text-center">Transform your child’s learning experience into something truly engaging and effective</p>
			<div class="relative w-[90%] mx-auto flex items-center mt-20">
				<img src="/images/y.png" />
				<div class="w-1/2 flex items-center justify-center">
					<img src="/images/bot+human.png" class="w-[500px] h-[500px] object-contain" />
				</div>
				<div class="w-1/2 flex flex-col gap-2">
					<h3 class="text-[36px] font-bold leading-[54px]">Hybrid tutoring</h3>
					<p class="text-[24px] leading-[36px]">AI + Human Experts</p>
					<p class="w-4/5 text-[16px] leading-[24px]">
						Elevate your learning experience with the synergy of AI technology and the insight of seasoned educators.
					</p>
					<RouterLink to="/register" class="self-start bg-purple text-white py-[10px] px-[30px] h-[44px] rounded-[22px]">
						Know more
					</RouterLink>
				</div>
				<img class="absolute right-20 -top-10" src="/images/skewed-green-box.png" />
			</div>
		</div>
		<!-- Classes -->
		<div class="w-[90%] my-20 mx-auto styled-bg h-[600px] rounded-[20px] flex items-center justify-between">
			<div class="w-1/2 mx-auto flex flex-col pl-[160px] justify-center gap-2">
				<h3 class="text-white font-bold text-[36px] leading-[54px]">Classes</h3>
				<h4 class="text-white text-[24px]">Self Paced & Live Classes</h4>
				<p class="text-white text-[16px] leading-[24px] font-normal">
					Learn on Your Own Time or Dive into Real-Time Interaction. Seize control of your learning journey: embrace the
					tranquility of self-paced study or immerse yourself in the energy of live classes.
				</p>
				<RouterLink to="#" class="self-start bg-white py-[10px] px-[30px] h-[44px] rounded-[22px]">Know more </RouterLink>
			</div>
			<div class="w-1/2 flex items-center justify-center">
				<img src="/images/live-classes.png" />
			</div>
		</div>
		<!-- MarketPlace -->
		<div class="my-20 h-[600px] flex items-center justify-between">
			<div class="w-1/2 flex items-center justify-center">
				<img src="/images/marketplace.png" />
			</div>
			<div class="w-1/2 flex flex-col gap-2">
				<div class="w-full">
					<img class="ml-auto mr-[10%]" src="/images/marketplace-top.png" />
				</div>
				<h3 class="font-bold text-[36px] leading-[54px]">Marketplace</h3>
				<h4 class="text-[24px]">Explore & Discover materials</h4>
				<p class="w-3/5 text-[16px] leading-[24px] font-normal">
					Welcome to a vibrant ecosystem where learning flourishes and possibilities abound. Our Learning Marketplace is more than
					just a platform—it's a community of passionate learners, dedicated educators, and cutting-edge resources.
				</p>
				<RouterLink to="#" class="self-start bg-purple text-white py-[10px] px-[30px] h-[44px] rounded-[22px]">
					Know more
				</RouterLink>
				<div class="w-3/5">
					<img class="ml-auto" src="/images/marketplace-y.png" />
				</div>
			</div>
		</div>
		<!-- Create -->
		<div class="w-[90%] my-20 mx-auto styled-bg h-[600px] rounded-[20px] flex items-center justify-between">
			<div class="w-1/2 mx-auto flex flex-col pl-[160px] justify-center gap-2">
				<h3 class="text-white font-bold text-[36px] leading-[54px]">Create</h3>
				<h4 class="text-white text-[24px]">Quizzes, Courses, Games, Flashcards.</h4>
				<p class="text-white text-[16px] leading-[24px] font-normal">
					From interactive quizzes that test your knowledge to expertly curated courses that guide your learning, from engaging
					games that make studying fun to customizable flashcards that reinforce key concepts – our platform offers a diverse
					range of resources designed to cater to every learning style and preference.
				</p>
				<RouterLink to="#" class="self-start bg-white py-[10px] px-[30px] h-[44px] rounded-[22px]">Know more </RouterLink>
			</div>
			<div class="w-1/2 flex items-center justify-center">
				<img src="/images/quiz.png" class="ml-auto" />
			</div>
		</div>
		<!-- Access preparatory classes -->
		<div class="w-full bg-[#F9FAFB] h-[389px] flex flex-col justify-center items-center overflow-hidden mb-20">
			<div class="flex flex-col gap-2">
				<h4 class="font-bold text-[36px] text-purple text-center leading-[48px]">
					Access Preparatory Classes for top examinations
				</h4>
				<p class="text-[16px] text-center">Access a world of interactive learning with quizzes and courses created</p>
			</div>
			<div class="flex items-center">
				<img v-for="i in 10" :key="i" src="/images/jamb.png" />
			</div>
		</div>
		<!-- Popular Learning centers -->
		<div class="styled-bg h-[514px] w-full flex flex-col justify-center items-center gap-8 mb-20 overflow-hidden">
			<div class="flex flex-col gap-2">
				<h4 class="font-bold text-[32px] text-white text-center leading-[48px]">Popular learning centers we collaborate with</h4>
				<p class="text-white text-[16px] text-center">Lorem ipsum dolor sit amet consectetur. Nisi sed bibendum in diam.</p>
			</div>
			<Vue3Marquee :duration="200" :pauseOnHover="true">
				<div v-for="i in 20" :key="i" class="bg-white p-4 rounded-lg flex items-center gap-2 w-[261px] mx-4">
					<img src="/images/dp.png" />
					<div class="flex flex-col gap-1">
						<div class="flex items-center gap-1">
							<p class="text-[15px] font-medium">Harvard Academy</p>
							<SofaIcon name="verify" />
						</div>
						<span class="text-[12px] text-[#5A5A5A]">Ikeja GRA, Lagos</span>
					</div>
				</div>
			</Vue3Marquee>
			<RouterLink to="#" class="bg-white py-[10px] px-[30px] h-[44px] rounded-[22px]">Find more</RouterLink>
		</div>
		<!-- Get app -->
		<div class="w-[80%] mx-auto flex items-center justify-between">
			<div class="w-1/2 flex flex-col items-center gap-4">
				<h1 class="font-bold text-[32px] text-center">Get The App</h1>
				<RouterLink to="#"><img src="/images/app-store-badge.png" /></RouterLink>
				<RouterLink to="#"><img src="/images/playstore-badge.png" /></RouterLink>
			</div>
			<div class="w-1/2 flex flex-col items-center">
				<img src="/images/get-app.png" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { Vue3Marquee } from 'vue3-marquee'
</script>

<style scoped>
.styled-bg {
	background: url('/images/layer.png'), linear-gradient(rgba(150, 77, 222, 1), rgba(150, 77, 222, 1), rgba(150, 77, 222, 1));
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
}
</style>
