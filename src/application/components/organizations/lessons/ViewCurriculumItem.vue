<template>
	<div class="p-4 flex flex-col gap-6">
		<div class="flex w-full items-center gap-2 justify-between">
			<SofaHeaderText class="!font-bold !text-deepGray" :content="title" />
			<div class="flex items-center gap-4">
				<SofaIcon class="h-[16px] fill-black" name="back-arrow" :class="canPrev ? 'fill-black' : 'fill-grayColor'" @click="prev" />
				<SofaIcon
					class="h-[16px] fill-black"
					name="arrow-right-white"
					:class="canNext ? 'fill-black' : 'fill-grayColor'"
					@click="next" />
				<SofaIcon class="h-[16px]" name="circle-close" @click="close" />
			</div>
		</div>
		<div class="w-full overflow-y-hidden h-[350px] mdlg:h-[550px]">
			<div v-if="curriculumItem.type === 'schedule'" class="h-full">
				<ScheduleItem :classInst="classInst" :schedule="curriculumItem.schedule" />
			</div>
			<div
				v-if="curriculumItem.type === 'file'"
				class="w-full rounded-custom h-full flex items-center justify-center bg-lightGray overflow-y-auto">
				<div v-if="curriculumItem.fileType === FileType.document && mediaUrl" class="w-full h-full">
					<SofaDocumentReader :documentUrl="mediaUrl" class="!w-full !h-full" />
				</div>
				<div v-if="curriculumItem.fileType === FileType.image && mediaUrl" class="w-full h-full">
					<SofaImageLoader :photoUrl="mediaUrl" customClass="!w-full !h-full rounded-custom" />
				</div>
				<div v-if="curriculumItem.fileType === FileType.video && mediaUrl" class="w-full h-full">
					<SofaVideoPlayer :videoUrl="mediaUrl" :type="curriculumItem.file.media.type" class="!w-full !h-full" />
				</div>
			</div>
			<div
				v-if="curriculumItem.type === 'quiz'"
				class="rounded-custom h-full flex items-center justify-center"
				:class="quizStarted ? 'bg-lightGray' : 'bg-primaryPurple'">
				<div v-if="!quizStarted" class="flex flex-col items-center gap-3">
					<SofaHeaderText color="text-white">{{
						curriculumItem.quizMode === QuizModes.practice ? 'Practice questions' : 'Test yourself'
					}}</SofaHeaderText>
					<SofaNormalText color="text-white">{{
						curriculumItem.quizMode === QuizModes.practice
							? 'Comfortable learning for topic mastery'
							: 'Evaluate your level of knowledge'
					}}</SofaNormalText>
					<SofaNormalText color="text-white">20 questions</SofaNormalText>
					<SofaButton
						bgColor="bg-white"
						textColor="text-primaryBlue"
						padding="py-3 px-9"
						customClass="font-bold"
						@click="startQuiz">
						{{ 'Start' }}
					</SofaButton>
				</div>
				<div v-else></div>
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<SofaHeaderText>{{ curriculumSection.label }}</SofaHeaderText>
			<SofaNormalText>{{ `${curriculumSection.label}/${fileName}` }}</SofaNormalText>
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
import { computed, ref, watch, onBeforeMount } from 'vue'
import { ClassEntity, ClassLessonable, ExtendCurriculum } from '@modules/organizations'
import { FileType, QuizModes } from '@modules/study'
const props = defineProps<{
	close: () => void
	classInst: ClassEntity
	curriculum: ExtendCurriculum
	itemIndex: number
	sectionIndex: number
}>()

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
const fileName = computed(() => {
	if (curriculumItem.value.type === ClassLessonable.file) {
		return curriculumItem.value.file.title
	} else if (curriculumItem.value.type === ClassLessonable.quiz) {
		return curriculumItem.value.quiz.title
	} else {
		return curriculumItem.value.schedule.title
	}
})
const mediaUrl = ref('')

const curriculumSection = computed(() => props.curriculum[props.sectionIndex])

const activeItemIndex = ref(props.itemIndex)

const curriculumItem = computed(() => props.curriculum[props.sectionIndex].items[activeItemIndex.value])

const quizStarted = ref(false)
const startQuiz = () => {
	quizStarted.value = true
}

const canNext = computed(() => activeItemIndex.value < props.curriculum[props.sectionIndex].items.length - 1)
const canPrev = computed(() => activeItemIndex.value > 0)
const next = () => {
	if (canNext.value) activeItemIndex.value++
}
const prev = () => {
	if (canPrev.value) activeItemIndex.value--
}

watch(curriculumItem, async () => {
	if (curriculumItem.value.type === 'file') {
		const url = await curriculumItem.value.file.getMediaUrl()
		console.log(url)
		mediaUrl.value = url
	}
})

onBeforeMount(async () => {
	if (curriculumItem.value.type === 'file') {
		const url = await curriculumItem.value.file.getMediaUrl()
		console.log(url)
		mediaUrl.value = url
	}
})
</script>
