<template>
	<main class="w-full bg-white max-w-[1800px] mx-auto">
		<header class="flex gap-[44px] flex-col items-center justify-center bg-[#29001a] relative">
			<HomeNavbar class="z-50" />
			<!-- Link -->
			<div
				class="z-50 flex items-center bg-white h-[44px] rounded-[22px] w-[268px] overflow-hidden"
				style="box-shadow: 0px 4px 16px 0px #00000040">
				<router-link
					to="/home/students"
					class="w-1/2 h-full flex items-center justify-center p-5 rounded-[22px] text-[14px] md:text-[16px]">
					Students
				</router-link>
				<router-link
					to="/home/organization"
					class="w-1/2 h-full flex items-center justify-center p-5 bg-purple text-white rounded-[22px] text-[14px] md:text-[16px]">
					Organizations
				</router-link>
			</div>
			<div class="z-10 absolute top-[65px] left-0 right-0 w-full bg-[#d500a1] rounded-b-full h-[400px] blur-[100px]"></div>
			<div class="z-50 w-[90%] mdlg:min-h-[400px] relative">
				<div class="w-[90%] md:w-[70%] mdlg:w-[50%] mx-auto flex flex-col items-center justify-center text-center gap-4">
					<h1
						class="text-[18px] text-white leading-[27px] md:text-[30px] md:leading-[40px] mdlg:text-[40px] text-center font-600 mdlg:leading-[60px] font-semibold">
						Unlock Your Child's Potential with Personalized
					</h1>
					<div
						class="bg-purple text-white w-[174px] text-[20px] mdlg:text-[40px] font-600 font-semibold rounded-lg h-[38px] mdlg:h-[80px] mdlg:w-[387px] flex items-center justify-center -rotate-6 mb-4">
						Infrastructure
					</div>
					<p class="text-[14px] text-white md:text-[16px] leading-[24px]">
						Empower educators, engage learners, and streamline operations with our comprehensive learning platform
					</p>
					<div class="flex flex-col md:flex-row items-center gap-3">
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
				<img class="hidden mdlg:block absolute top-0 right-0" src="/images/smiles.png" />
				<img class="hidden mdlg:block absolute -bottom-14 left-0" src="/images/arrow-svg-white.png" />
			</div>
			<div class="z-50 w-[90%] mt-[30px] mdlg:mt-0 mx-auto flex md:items-center md:justify-center">
				<img
					src="/images/organization-hero-image.png"
					class="w-full h-full mdlg:h-[450px] mdlg:w-[767px] object-cover md:object-contain" />
			</div>
			<img class="z-50 w-[90%] mx-auto -mb-10 md:-mb-24 h-full" src="/images/stranerd-stats.png" />
		</header>
		<MoreOnStranerd class="mt-[100px] mdlg:mt-[180px]" />
		<HomeFooter />
	</main>
</template>

<script setup lang="ts"></script>
