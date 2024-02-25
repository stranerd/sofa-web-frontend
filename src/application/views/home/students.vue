<template>
	<main class="flex flex-col gap-[150px] bg-white">
		<header class="flex flex-col items-center justify-center">
			<HomeNavbar class="mb-[44px]" />
			<!-- Link -->
			<div
				class="flex items-center bg-white h-[44px] rounded-[22px] w-[268px] overflow-hidden mb-[44px]"
				style="box-shadow: 0px 4px 16px 0px #00000040">
				<router-link
					to="/home/students"
					class="w-1/2 h-full flex items-center justify-center p-5 bg-purple text-white rounded-[22px]">
					Students
				</router-link>
				<router-link to="/home/organization" class="w-1/2 h-full flex items-center justify-center p-5"> Organizations </router-link>
			</div>
			<div class="w-[90%] min-h-[500px] relative">
				<div class="w-[50%] mx-auto flex flex-col items-center justify-center text-center gap-4">
					<h1 class="text-[40px] text-center font-600 leading-[60px] font-semibold">
						Transforming Learning Centers with Our Cutting-Edge
					</h1>
					<div
						class="bg-purple text-white text-[40px] font-600 font-semibold rounded-lg h-[80px] w-[387px] flex items-center justify-center -rotate-6 mb-4">
						Infrastructure
					</div>
					<p class="text-[16px] leading-[24px]">
						Empower educators, engage learners, and streamline operations with our comprehensive learning platform
					</p>
					<div class="flex items-center gap-3">
						<RouterLink to="/register" class="bg-purple text-white py-[10px] px-[30px] h-[44px] rounded-[22px]">
							Get started
						</RouterLink>
						<RouterLink
							to="/"
							class="flex items-center justify-center gap-[10px] border border-purple text-pruple py-[10px] px-[30px] h-[44px] rounded-[22px]">
							<SofaIcon name="solar_play-circle-bold" />
							<span class="text-purple">Watch video</span>
						</RouterLink>
					</div>
				</div>
				<img class="absolute top-0 right-0" src="/images/smiles.png" />
				<img class="absolute bottom-0 left-0" src="/images/arrow-svg.png" />
			</div>
			<div class="w-[90%] mx-auto flex items-center justify-center">
				<img src="/images/students-hero-image.png" class="w-full h-[866px] object-contain" />
			</div>
		</header>
		<MoreOnStranerd />
		<HomeFooter />
	</main>
</template>

<script setup lang="ts"></script>
