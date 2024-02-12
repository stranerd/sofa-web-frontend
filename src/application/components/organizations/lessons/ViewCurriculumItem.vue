<template>
	<div class="p-4 flex flex-col gap-6">
		<div class="flex w-full items-center gap-2 justify-between">
			<SofaHeaderText class="!font-bold !text-deepGray" :content="title" />
			<div class="flex items-center gap-4">
				<SofaIcon class="h-[16px] fill-black" name="back-arrow" />
				<SofaIcon class="h-[16px] fill-black" name="arrow-right-white" />
				<SofaIcon class="h-[16px]" name="circle-close" @click="close" />
			</div>
		</div>
		<div class="w-full">
			<!-- <div
				v-if="curriculumItem.type === 'schedule'"
				class="rounded-custom h-[600px] flex items-center justify-center"
				:class="curriculumItem.schedule.isOngoing ? 'bg-primaryRed' : 'bg-primaryPurple'">
				<div class="flex flex-col items-center gap-3">
					<SofaHeaderText color="text-white">Live Session</SofaHeaderText>
					<div class="flex items-center gap-2">
						<SofaIcon class="h-[16px] fill-white" name="tutor" />
						<SofaNormalText color="text-white">{{ curriculumItem.schedule.user.bio.publicName }}</SofaNormalText>
					</div>
					<div class="flex items-center gap-2">
						<SofaIcon name="calendar" class="h-[17px] !fill-white" />
						<SofaNormalText :content="formatTime(curriculumItem.schedule.time.start)" color="text-white" />
						<div class="w-[5px] h-[5px] rounded-[50%] bg-white" />
						<SofaNormalText :content="formatTime(curriculumItem.schedule.time.end)" color="text-white" />
					</div>
					<SofaButton
						bgColor="bg-white"
						:textColor="curriculumItem.schedule.isOngoing ? 'text-primaryRed' : 'text-primaryBlue'"
						:class="curriculumItem.schedule.isOngoing ? '' : 'opacity-50 cursor-not-allowed'"
						padding="py-3 px-9"
						customClass="font-bold">
						{{ 'Enter' }}
					</SofaButton>
				</div>
			</div> -->
			<!-- <div
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
			<div v-if="fileType.type === 'file'" class="rounded-custom h-[600px] flex items-center justify-center bg-lightGray"></div> -->
		</div>
		<div class="flex flex-col gap-2">
			<SofaHeaderText>{{ curriculumSection.label }}</SofaHeaderText>
			<!-- <SofaNormalText>{{ `Mathematics/${curriculumSection.label}` }}</SofaNormalText> -->
		</div>
		<!-- Question section -->
		<!-- <div class="flex flex-col items-start gap-6">
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
		</div> -->
	</div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount } from 'vue'
import { ClassEntity, ClassLesson, ClassLessonable } from '@modules/organizations'
import { FileType, QuizModes } from '@modules/study'
// import { formatTime } from '@utils/dates'
const props = defineProps<{
	close: () => void
	classInst: ClassEntity
	curriculum: ClassLesson['curriculum']
	itemIndex: number
	sectionIndex: number
}>()
// const curriculumItem = ref();
// const fileType = ref({
// 	type: 'file',
// 	active: true,
// 	mode: 'practice',
// })
// const quizStarted = ref(true)
const title = computed(() => {
	if (curriculumItem.value.type === ClassLessonable.schedule) {
		return 'Live Session'
	}
	if (curriculumItem.value.type === ClassLessonable.quiz) {
		if (curriculumItem.value.quizMode === QuizModes.practice) {
			return 'Practice'
		} else {
			return 'Test'
		}
	}
	if (curriculumItem.value.type === ClassLessonable.file) {
		if (curriculumItem.value.fileType === FileType.document) {
			return 'Document'
		}
		if (curriculumItem.value.fileType === FileType.image) {
			return 'Image'
		}
		if (curriculumItem.value.fileType === FileType.video) {
			return 'Video'
		}
	}
	return 'Curriculum Item'
})
onBeforeMount(() => {
	console.log(props.curriculum)
	console.log(props.curriculum[props.sectionIndex].items[props.itemIndex])
})
const curriculumSection = computed(() => props.curriculum[props.sectionIndex])
const curriculumItem = computed(() => {
	console.log(props.curriculum[props.sectionIndex].items[props.itemIndex])
	return props.curriculum[props.sectionIndex].items[props.itemIndex]
})
</script>
