<template>
	<div id="wide-audience" class="w-[90%] mx-auto max-w-[1800px]">
		<div class="relative flex mdlg:flex-row flex-col items-center mt-8 mdlg:mt-20">
			<div class="w-full mdlg:w-1/2 flex items-center justify-center">
				<img
					src="/images/landing/organization-wide-audience.png"
					class="w-[80%] md:w-[500px] h-full mdlg:h-[500px] object-contain" />
			</div>
			<div class="w-full mdlg:w-1/2 flex flex-col items-center mdlg:items-start text-center mdlg:text-left gap-2">
				<h3 class="text-[20px] md:text-[36px] font-bold md:leading-[54px]">Wider Audience</h3>
				<p class="text-[16px] md:text-[24px] leading-[36px]"></p>
				<p class="w-4/5 text-[14px] md:text-[16px] leading-[24px] tracking-wide">
					No more restrictions. Reach a wider audience with the help of Stranerd, taking your organization to the next level.
				</p>
				<RouterLink
					to="#"
					class="mdlg:self-start bg-purple text-[14px] md:text-[16px] text-white py-[10px] px-[30px] h-[44px] rounded-[22px]">
					Know more
				</RouterLink>
			</div>
			<img class="hidden mdlg:block absolute right-20 -top-10" src="/images/landing/y.png" />
		</div>
	</div>
</template>

<script setup lang="ts"></script>
