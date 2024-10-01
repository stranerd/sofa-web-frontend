<template>
	<QuizLayout>
		<div class="w-full flex flex-col gap-6 justify-center items-center p-6 rounded-custom bg-white">
			<SofaTextarea placeholder="Enter questions" class="w-full h-[100px]" :resize="false" />
			<!-- <div class="w-full p-3 h-[100px] rounded-custom bg-lightGray">
				<div class="flex items-center gap-2">
					<SofaIcon name="question-type" class="h-[15px] fill-grayColor" />
					<SofaText content="Enter questions" size="sub" class="text-grayColor" />
				</div>
			</div> -->
			<div class="w-full flex justify-center items-center p-3 h-[70px] rounded-custom bg-primaryPurple">
				<div class="flex items-center gap-2">
					<SofaText content="Choose image to add to this question (optional)" size="sub" class="text-white" />
					<SofaFileInput accept="image/png" class="rounded-custom bg-white py-1 px-3 font-bold text-black shadow-customInverted"
					>Add Image</SofaFileInput
					>
				</div>
			</div>
			<div
				v-for="(icon, index) in optionIcon"
				:key="icon"
				class="w-full flex items-center p-3 h-[55px] rounded-custom border-2 border-lightGray">
				<div class="flex items-center gap-2">
					<SofaIcon :name="icon" class="h-[15px]" />
					<SofaText :content="`Enter option ${index + 1}`" size="sub" class="text-grayColor" />
				</div>
			</div>
			<SofaTextarea placeholder="Enter questions" class="w-full h-[100px]" :resize="false" />
			<!-- <div class="w-full p-3 h-[100px] rounded-custom bg-lightGray">
				<div class="flex items-center gap-2">
					<SofaIcon name="question-type" class="h-[15px] fill-grayColor" />
					<SofaText content="Enter questions" size="sub" class="text-grayColor" />
				</div>
			</div> -->
		</div>
	</QuizLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const optionIcon = ref<IconName[]>(['q-circle', 'q-triangle', 'q-square', 'q-kite'])
</script>
