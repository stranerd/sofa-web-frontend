<template>
	<div
		id="personalized-learning"
		class="w-[90%] max-w-[1100px] mt-[220px] md:mt-[300px] mdlg:my-20 mx-auto styled-bg min-h-[290px] pb-8 md:pb-0 mdlg:h-[400px] rounded-[20px] flex flex-col mdlg:flex-row items-center justify-between relative">
		<div
			class="w-full order-2 mdlg:order-1 mdlg:w-1/2 mx-auto flex flex-col mt-10 mdlg:mt-0 mdlg:pl-[80px] justify-center gap-2 text-center px-8 mdlg:text-left">
			<h3 class="text-white font-bold text-[20px] md:text-[30px]">{{ content?.title }}</h3>
			<p class="text-white text-[14px] md:text-[16px] leading-[24px] font-normal">
				{{ content?.content }}
			</p>
			<RouterLink
				to="/home/features"
				class="self-center mdlg:self-start text-[14px] md:text-[16px] bg-white py-[10px] px-[30px] h-[44px] rounded-[22px]">
				Know more
			</RouterLink>
		</div>
		<div
			class="absolute left-0 right-0 -top-[250px] mdlg:-top-0 mdlg:relative order-1 mdlg:order-2 w-full mdlg:w-1/2 flex items-center justify-center">
			<img :src="content?.image" class="hidden mdlg:block mdlg:ml-12" />
			<img :src="content?.mobileImage" class="mdlg:hidden mb-[-350px]" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ContentType } from './MoreOnStranerd.vue'

defineProps({
	content: {
		type: Object as () => ContentType,
	},
})
</script>
