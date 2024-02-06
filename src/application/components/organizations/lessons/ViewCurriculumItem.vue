<template>
	<div class="p-4 flex flex-col gap-6">
		<div class="flex w-full items-center gap-2 justify-between">
			<SofaHeaderText class="!font-bold !text-deepGray" :content="title" />
			<div class="flex items-center gap-4">
				<SofaIcon class="h-[16px] fill-black" name="back-arrow" />
				<SofaIcon class="h-[16px] fill-black" name="arrow-right-white" />
				<SofaIcon class="h-[16px]" name="circle-close" />
			</div>
		</div>
		<div class="w-full">
			<div
				v-if="fileType.type === 'schedule'"
				class="rounded-custom h-[600px] flex items-center justify-center"
				:class="fileType.active ? 'bg-primaryRed' : 'bg-primaryPurple'">
				<div class="flex flex-col items-center gap-3">
					<SofaHeaderText color="text-white">Live Session</SofaHeaderText>
					<div class="flex items-center gap-2">
						<SofaIcon class="h-[16px] fill-white" name="tutor" />
						<SofaNormalText color="text-white">{{ 'Tewogbade Adedeji' }}</SofaNormalText>
					</div>
					<div class="flex items-center gap-2">
						<SofaIcon name="calendar" class="h-[17px] !fill-white" />
						<SofaNormalText content="15:00" color="text-white" />
						<div class="w-[5px] h-[5px] rounded-[50%] bg-white" />
						<SofaNormalText content="15:30" color="text-white" />
					</div>
					<SofaButton
						bgColor="bg-white"
						:textColor="fileType.active ? 'text-primaryRed' : 'text-primaryBlue'"
						:class="fileType.active ? '' : 'opacity-50 cursor-not-allowed'"
						padding="py-3 px-9"
						customClass="font-bold">
						{{ 'Enter' }}
					</SofaButton>
				</div>
			</div>
			<div
				v-if="fileType.type === 'quiz'"
				class="rounded-custom h-[600px] flex items-center justify-center"
				:class="quizStarted ? 'bg-lightGray' : 'bg-primaryPurple'">
				<div v-if="!quizStarted" class="flex flex-col items-center gap-3">
					<SofaHeaderText color="text-white">{{
						fileType.mode === 'practice' ? 'Practice questions' : 'Test yourself'
					}}</SofaHeaderText>
					<SofaNormalText color="text-white">{{
						fileType.mode === 'practice' ? 'Comfortable learning for topic mastery' : 'Evaluate your level of knowledge'
					}}</SofaNormalText>
					<SofaNormalText color="text-white">20 questions</SofaNormalText>
					<SofaButton bgColor="bg-white" textColor="text-primaryBlue" padding="py-3 px-9" customClass="font-bold">
						{{ 'Start' }}
					</SofaButton>
				</div>
				<div v-else></div>
			</div>
			<div v-if="fileType.type === 'file'" class="rounded-custom h-[600px] flex items-center justify-center bg-lightGray"></div>
		</div>
		<div class="flex flex-col gap-2">
			<SofaHeaderText>{{ 'Indices' }}</SofaHeaderText>
			<SofaNormalText>{{ 'Mathematics/Indices' }}</SofaNormalText>
		</div>
		<div class="flex flex-col items-start gap-6">
			<SofaHeaderText color="text-primaryPurple" customClass="border-b-2 border-primaryPurple">Questions</SofaHeaderText>
			<form
				class="w-full flex gap-2 items-center bg-fadedPurple rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg mdlg:!rounded-lg px-1">
				<input
					:disabled="true"
					class="w-full text-bodyBlack focus:outline-none !max-h-[80px] overflow-hidden bg-transparent rounded-lg p-3 items-start text-left text-sm overflow-y-auto"
					placeholder="Ask a question" />
				<button type="submit" class="min-w-[45px] h-[40px] flex items-center justify-center pr-[5px]">
					<SofaIcon name="send" class="h-[19px]" />
				</button>
			</form>
			<QuestionCard />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
// import { ClassEntity, ClassLesson } from '@modules/organizations'
// defineProps<{
// 	close: () => void
// 	classInst: ClassEntity
// 	curriculum: ClassLesson['curriculum']
// 	index: number
// }>()
const fileType = ref({
	type: 'file',
	active: true,
	mode: 'practice',
})
const quizStarted = ref(true)
const title = computed(() => {
	if (fileType.value.type === 'schedule') {
		return 'Live Session'
	}
	if (fileType.value.type === 'quiz') {
		if (fileType.value.mode === 'practice') {
			return 'Practice'
		} else {
			return 'Test'
		}
	}
	if (fileType.value.type === 'file') {
		return 'Document' || 'Image' || 'Video'
	}
	return 'Curriculum Item'
})
</script>
