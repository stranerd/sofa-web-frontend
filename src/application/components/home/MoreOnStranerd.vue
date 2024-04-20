<template>
	<div class="w-full flex flex-col items-center justify-center">
		<!-- New and exciting ways to study -->
		<div id="study" class="w-[90%] mx-auto max-w-[1800px]">
			<h2 class="text-[20px] md:text-[32px] text-purple font-bold leading-[54px] text-center">{{ content.study.title }}</h2>
			<p class="text-[14px] md:text-[16px] text-center">
				{{ content.study.desc }}
			</p>
			<div class="relative flex mdlg:flex-row flex-col items-center mt-8 mdlg:mt-20">
				<img class="hidden mdlg:block" src="/images/y.png" />
				<div class="w-full mdlg:w-1/2 flex items-center justify-center">
					<img src="/images/bot+human.png" class="w-[80%] md:w-[500px] h-full mdlg:h-[500px] object-contain" />
				</div>
				<div class="w-full mdlg:w-1/2 flex flex-col items-center mdlg:items-start text-center mdlg:text-left gap-2">
					<h3 class="text-[20px] md:text-[36px] font-bold md:leading-[54px]">{{ content.study.heading }}</h3>
					<p class="text-[16px] md:text-[24px] leading-[36px]">{{ content.study.sub_heading }}</p>
					<p class="w-4/5 text-[14px] md:text-[16px] leading-[24px]">
						{{ content.study.content }}
					</p>
					<RouterLink
						v-if="content.study.link.length"
						:to="content.study.link"
						class="mdlg:self-start bg-purple text-[14px] md:text-[16px] text-white py-[10px] px-[30px] h-[44px] rounded-[22px]">
						Know more
					</RouterLink>
				</div>
				<img class="hidden mdlg:block absolute right-20 -top-10" src="/images/skewed-green-box.png" />
			</div>
		</div>
		<!-- Classes -->
		<div
			id="classes"
			class="w-[90%] max-w-[1800px] mt-[300px] mdlg:my-20 mx-auto styled-bg min-h-[290px] pb-8 md:pb-0 mdlg:h-[600px] rounded-[20px] flex flex-col mdlg:flex-row items-center justify-between relative">
			<div
				class="w-full order-2 mdlg:order-1 mdlg:w-1/2 mx-auto flex flex-col mt-10 mdlg:mt-0 mdlg:pl-[160px] justify-center gap-2 text-center px-8 mdlg:text-left">
				<h3 class="text-white font-bold text-[20px] md:text-[36px] leading-[54px]">{{ content.classes.title }}</h3>
				<h4 class="text-white text-[16px] md:text-[24px]">{{ content.classes.heading }}</h4>
				<p class="text-white text-[14px] md:text-[16px] leading-[24px] font-normal">
					{{ content.classes.content }}
				</p>
				<RouterLink
					v-if="content.classes.link.length"
					:to="content.classes.link"
					class="self-center mdlg:self-start text-[14px] md:text-[16px] bg-white py-[10px] px-[30px] h-[44px] rounded-[22px]">
					Know more
				</RouterLink>
			</div>
			<div
				class="absolute left-0 right-0 -top-[250px] mdlg:-top-0 mdlg:relative order-1 mdlg:order-2 w-full mdlg:w-1/2 flex items-center justify-center">
				<img class="w-[250px] h-[290px] mdlg:h-[814px] mdlg:w-[578px]" src="/images/live-classes.png" />
			</div>
		</div>
		<!-- MarketPlace -->
		<div
			id="marketplace"
			class="w-[90%] max-w-[1800px] mx-auto mdlg:w-full my-20 mdlg:h-[600px] flex flex-col mdlg:flex-row items-center justify-between">
			<div class="w-full mdlg:w-1/2 flex items-center justify-center">
				<img class="w-[90%] mdlg:w-full mdlg:h-full" src="/images/marketplace.png" />
			</div>
			<div class="w-full mdlg:w-1/2 flex flex-col mdlg:items-start items-center text-center mdlg:text-left gap-2">
				<div class="hidden mdlg:block w-full">
					<img class="ml-auto mr-[10%]" src="/images/marketplace-top.png" />
				</div>
				<h3 class="font-bold text-[20px] md:text-[36px] md:leading-[54px]">{{ content.place.title }}</h3>
				<h4 class="text-[16px] md:text-[24px]">{{ content.place.heading }}</h4>
				<p class="md:w-3/5 text-[14px] md:text-[16px] leading-[24px] font-normal">
					{{ content.place.content }}
				</p>
				<RouterLink
					v-if="content.place.link.length"
					:to="content.place.link"
					class="mdlg:self-start bg-purple text-[14px] md:text-[16px] text-white py-[10px] px-[30px] h-[44px] rounded-[22px]">
					Know more
				</RouterLink>
				<div class="hidden mdlg:block w-3/5">
					<img class="ml-auto" src="/images/marketplace-y.png" />
				</div>
			</div>
		</div>
		<!-- Create -->
		<div
			v-if="content.create.show"
			id="create"
			class="w-[90%] max-w-[1800px] mt-[250px] mb-20 mdlg:my-20 mx-auto styled-bg min-h-[290px] py-8 mdlg:h-[600px] rounded-[20px] flex flex-col mdlg:flex-row items-center justify-between relative">
			<div class="w-full mdlg:w-1/2 mx-auto flex flex-col mdlg:pl-[160px] justify-center gap-2 px-8 mdlg:px-0">
				<h3 class="text-white font-bold text-[20px] md:text-[36px] md:leading-[54px]">{{ content.create.title }}</h3>
				<h4 class="text-white text-[16px] md:text-[24px]">{{ content.create.heading }}</h4>
				<p class="text-white text-[14px] md:text-[16px] leading-[24px] font-normal">
					{{ content.create.content }}
				</p>
				<RouterLink
					v-if="content.create.link.length"
					:to="content.create.link"
					class="self-start text-[14px] md:text-[16px] bg-white py-[10px] px-[30px] h-[44px] rounded-[22px]">
					Know more
				</RouterLink>
			</div>
			<div
				class="abs absolute left-0 right-0 -top-[250px] sm:-top-[400px] mdlg:relative mdlg:-top-0 w-full mdlg:w-1/2 flex items-center justify-center">
				<img src="/images/quiz.png" class="ml-auto" />
			</div>
		</div>
		<!-- Access preparatory classes -->
		<div v-if="content.access.show" class="w-full bg-[#F9FAFB] h-[389px] mb-20 flex items-center justify-center">
			<div class="flex flex-col justify-center items-center overflow-hidden w-full max-w-[1800px] mx-auto">
				<div class="w-[90%] mx-auto flex flex-col gap-2">
					<h4 class="font-bold text-[20px] md:text-[36px] text-purple text-center leading-[30px] md:leading-[48px]">
						Access Preparatory Classes for top examinations
					</h4>
					<p class="text-[12px] md:text-[16px] text-center">
						Access a world of interactive learning with quizzes and courses created
					</p>
				</div>
				<Vue3Marquee :duration="200" :pauseOnHover="true" class="flex items-center">
					<img v-for="(image, index) in images" :key="index" :src="image" />
				</Vue3Marquee>
			</div>
		</div>
		<!-- Discover  study materials-->
		<HomeDiscoverMaterials v-if="content.discover.show" />
		<!-- Testimonials -->
		<HomeTestimonials v-if="content.testimonial.show" class="mb-20" />
		<!-- Popular Learning centers -->
		<div
			v-if="content.learningCenters.show"
			class="styled-bg h-[400px] md:h-[514px] w-full flex flex-col justify-center items-center gap-8 mb-20 overflow-hidden">
			<div class="w-[90%] mx-auto mdlg:w-full flex flex-col gap-2">
				<h4 class="font-bold text-[20px] md:text-[32px] text-white text-center leading-[48px]">
					Popular learning centers we collaborate with
				</h4>
				<p class="text-white text-[12px] md:text-[16px] text-center">
					Lorem ipsum dolor sit amet consectetur. Nisi sed bibendum in diam.
				</p>
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
		<!-- FAQS -->
		<HomeFAQS v-if="content.faqs.show" />
		<!-- Get app -->
		<div
			v-if="content.getApp.show"
			class="w-[80%] max-w-[1800px] mt-20 md:mt-40 mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
			<div class="w-full md:w-1/2 order-2 md:order-1 flex flex-col items-center gap-4">
				<h1 class="font-bold text-[32px] text-center">Get The App</h1>
				<a :href="APPSTORE_LINK" target="_blank"><img src="/images/app-store-badge.png" /></a>
				<a :href="PLAYSTORE_LINK" target="_blank"><img src="/images/playstore-badge.png" /></a>
			</div>
			<div class="w-full order-1 md:order-2 md:w-1/2 flex flex-col items-center">
				<img src="/images/get-app.png" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Vue3Marquee } from 'vue3-marquee'

const { APPSTORE_LINK, PLAYSTORE_LINK } = $utils.constants
defineProps({
	content: {
		type: Object as () => IMoreOnStranerd,
		required: true,
	},
})
const images = ref(['/images/jamb.png', '/images/jupeb.png', '/images/waec.png', '/images/sat.png', '/images/neco.png', '/images/gce.png'])
</script>

<script lang="ts">
interface ShowType {
	show?: boolean
}

interface ContentType extends ShowType {
	title: string
	desc?: string
	heading: string
	sub_heading?: string
	content: string
	link: string
}

export interface IMoreOnStranerd {
	study: ContentType
	classes: ContentType
	place: ContentType
	create: ContentType
	testimonial: ShowType
	learningCenters: ShowType
	faqs: ShowType
	getApp: ShowType
	access: ShowType
	discover: ShowType
}
</script>

<style scoped>
.styled-bg {
	background: url('/images/layer.png'), linear-gradient(rgba(150, 77, 222, 1), rgba(150, 77, 222, 1), rgba(150, 77, 222, 1));
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
}
@media (max-width: 600px) {
	.abs {
		top: -350px;
	}
}
@media (max-width: 530px) {
	.abs {
		top: -300px;
	}
}
@media (max-width: 430px) {
	.abs {
		top: -250px;
	}
}
@media (max-width: 390px) {
	.abs {
		top: -200px;
	}
}
</style>
