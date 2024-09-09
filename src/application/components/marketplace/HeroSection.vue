<template>
	<div
		:class="[
			'w-full flex flex-col-reverse mdlg:flex-row gap-5 py-8 mdlg:py-0 mdlg:pt-8 px-10 mdlg:px-20 justify-center items-center mdlg:h-[600px]',
			bgColor,
		]">
		<div class="mdlg:w-[85%] h-full flex flex-col justify-center">
			<div class="w-[80%]">
				<SofaHeaderText :color="headerColor" size="2xl" class="!font-extrabold"
				>{{ headerContent }} <span v-if="showOrganization" class="text-primaryYellow">Organizations</span>
				</SofaHeaderText>
				<SofaNormalText :color="textColor" customClass="py-4 text-left flex items-center justify-center">
					{{ description }}
				</SofaNormalText>
			</div>

			<div class="flex flex-col mdlg:flex-row mdlg:items-center gap-3 w-full">
				<div class="flex items-center gap-2">
					<img :src="creatorImage" alt="Creators" class="w-20 h-auto object-fit" />
					<SofaHeaderText :color="textColor">{{ creatorsCount }} <span class="font-normal">Creators</span></SofaHeaderText>
				</div>
				<div class="flex items-center gap-2">
					<SofaIcon name="dropbox" class="bg-lightGray rounded-full p-2 w-10 h-10" />
					<SofaHeaderText :color="textColor">{{ coursesCount }} <span class="font-normal">Courses</span></SofaHeaderText>
				</div>
				<div class="flex items-center gap-2">
					<SofaIcon name="open-book" class="bg-lightGray rounded-full p-2 w-10 h-10" />
					<SofaHeaderText :color="textColor">{{ resourcesCount }} <span class="font-normal">Resources</span></SofaHeaderText>
				</div>
			</div>

			<div class="w-[80%] shadow-custom px-4 py-2 my-4 bg-white rounded-custom hidden mdlg:flex gap-3 items-center justify-between">
				<form class="flex gap-2 items-center flex-1" @submit.prevent="$emit('handleSearch')">
					<SofaIcon name="search-black" class="h-[17px] cursor-pointer w-[20px]" @click="$emit('handleSearch')" />
					<SofaTextField v-model="searchQuery" class="flex-1" customClass="!border-none w-full" placeholder="Search" />
				</form>
			</div>
		</div>
		<div class="h-full flex justify-center items-center">
			<SofaImageLoader :photoUrl="imageUrl" class="w-full h-full object-contain" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
	bgColor: {
		type: String,
		default: 'bg-primaryYellow',
	},
	headerColor: {
		type: String,
		default: 'text-primaryPurple',
	},
	headerContent: {
		type: String,
		required: true,
	},
	showOrganization: {
		type: Boolean,
		default: false,
	},
	textColor: {
		type: String,
		default: 'text-black',
	},
	description: {
		type: String,
		required: true,
	},
	creatorImage: {
		type: String,
		default: '/images/marketplace/creators.png',
	},
	creatorsCount: {
		type: String,
		default: '120+',
	},
	coursesCount: {
		type: String,
		default: '4500+',
	},
	resourcesCount: {
		type: String,
		default: '12000+',
	},
	imageUrl: {
		type: String,
		required: true,
	},
	searchQuery: {
		type: String,
		required: true,
	},
})
defineEmits<{
	(e: 'handleSearch'): void
}>()

const searchQuery = ref(props.searchQuery)
</script>
