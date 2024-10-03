<template>
	<FullLayout :hide="{ left: true, right: true }">
		<template #middle-session>
			<SofaModal>
				<!-- first content -->
				<template v-if="!type">
					<div class="w-full flex gap-4 justify-between items-center p-4 mdlg:p-6">
						<SofaHeading size="title">New Quiz</SofaHeading>
						<SofaIcon name="circle-close" class="h-[20px] w-[20px] fill-grayColor" />
					</div>
					<div class="w-full flex flex-col mdlg:flex-row justify-between items-center gap-6 p-6">
						<router-link
							v-for="quizType in createQuizTypes"
							:key="quizType.title"
							:to="`/study/quizzes/create-new?type=${quizType.value}`"
							class="bg-lightGray w-[224px] h-[202px] flex flex-col justify-center items-center text-center gap-4 rounded-lg p-3">
							<SofaIcon :name="quizType.icon" />
							<SofaHeading :content="quizType.title" />
							<SofaText :content="quizType.description" class="text-grayColor" size="sub" />
						</router-link>
					</div>
				</template>
				<template v-if="type === 'document' && !file">
					<div class="w-full flex gap-4 justify-between items-center p-4 mdlg:p-6">
						<SofaIcon name="arrow-left" class="h-[20px] w-[20px] fill-grayColor" />
						<SofaHeading size="title">Add a document</SofaHeading>
						<SofaIcon name="circle-close" class="h-[20px] w-[20px] fill-grayColor" />
					</div>
					<div
						class="w-4/5 mx-auto rounded-lg flex flex-col justify-center items-center gap-6 p-6 bg-lightGray h-[400px]"
						:class="{ 'border-2 border-dashed border-primaryBlue bg-opacity-50': isDragging }"
						@dragenter.prevent="isDragging = true"
						@dragleave.prevent="isDragging = false"
						@dragover.prevent
						@drop.prevent="handleDrop">
						<SofaIcon name="upload" class="bg-white rounded-full p-3 w-[50px] h-[50px] fill-black" />
						<SofaHeading size="title">{{ $screen.desktop ? 'Upload or Drag & Drop' : 'Upload' }}</SofaHeading>
						<SofaText
							content="Questions will be generated from the document you pick"
							class="text-grayColor text-center"
							size="sub" />
						<SofaText content="Max file size - 50MB | Max page limit - 50" class="text-grayColor" size="sub" />
						<SofaFileInput
							accept="application/pdf"
							class="rounded-lg bg-primaryBlue text-white py-4 px-3 font-bold shadow-customInverted"
							@update:modelValue="(media) => media && scrapPdf(media as Media)">
							{{ isLoading ? 'Processing...' : 'Choose from device' }}</SofaFileInput
						>
					</div>
				</template>
				<template v-if="type === 'topic'">
					<div class="w-full flex gap-4 justify-between items-center p-4 mdlg:p-6">
						<SofaIcon name="arrow-left" class="h-[20px] w-[20px] fill-grayColor" />
						<SofaHeading size="title">Enter topic</SofaHeading>
						<SofaIcon name="circle-close" class="h-[20px] w-[20px] fill-grayColor" />
					</div>
					<div class="w-4/5 mx-auto">
						<SofaInput placeholder="Write your topic in short detail" />
					</div>
				</template>
				<!-- PDF CONTENT -->
				<template v-if="type === 'document' && file">
					<div class="w-full flex gap-4 justify-between items-center p-4 mdlg:p-6">
						<SofaIcon name="arrow-left" class="h-[20px] w-[20px] fill-grayColor" />
						<SofaHeading size="title">Choose pages</SofaHeading>
						<SofaIcon name="circle-close" class="h-[20px] w-[20px] fill-grayColor" />
					</div>
					<div
						class="w-full flex flex-col-reverse items-end gap-4 mdlg:flex-row mdlg:justify-between mdlg:items-center p-4 mdlg:p-6">
						<div class="w-[200px] flex items-center justify-between">
							<SofaText content="Select page" size="sub" />
							<div class="flex items-center justify-between w-[100px]">
								<SofaInput min="1" max="50" type="number" class="!w-[30px] !h-[26px]" />
								<SofaText content="to" size="sub" />
								<SofaInput min="1" max="50" type="number" class="!w-[30px] !h-[26px]" />
							</div>
						</div>
						<div class="flex items-center">
							<SofaText content="Select all" size="sub" />
							<SofaCheckbox class="!w-auto" />
						</div>
					</div>
					<div
						class="w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 place-items-center mx-auto px-6 h-[400px] overflow-y-auto">
						<!-- empty page state -->
						<div v-for="i in 50" :key="i">
							<div class="border-2 border-lightGray flex justify-center items-center w-[100px] h-[122px] rounded-lg">
								<SofaIcon name="file-document" class="fill-grayColor h-[25px]" />
							</div>
							<div class="flex mdlg:justify-center items-center w-[100px] h-[30px]">
								<SofaCheckbox class="!w-auto" activeCheckBoxColor="fill-primaryPurple" />
								<SofaText :content="`Page ${i}`" class="text-grayColor" size="sub" />
							</div>
						</div>
					</div>
				</template>
				<!-- ADDING QUESTIONS GENERATED -->
				<template v-if="(type === 'document' && file) || type === 'topic'">
					<div class="w-full flex gap-4 justify-between items-center p-4 mdlg:p-6 border-b-2 border-lightGray">
						<SofaIcon name="arrow-left" class="h-[20px] w-[20px] fill-grayColor" />
						<SofaHeading size="title">Add questions</SofaHeading>
						<SofaIcon name="circle-close" class="h-[20px] w-[20px] fill-grayColor" />
					</div>
					<div class="mx-auto w-4/5 mdlg:w-11/12 flex flex-col gap-6 py-6">
						<div class="flex items-center gap-3">
							<SofaFileInput
								v-if="type === 'document'"
								accept="application/pdf"
								class="rounded-lg bg-lightGray flex items-center gap-2 flex-1 flex-grow p-3">
								<SofaIcon name="file-document" class="fill-black h-[20px]" />
								<SofaText v-if="file" :content="file.name" class="text-black" />
							</SofaFileInput>
							<SofaInput v-else placeholder="Write your topic in short detail" />
							<SofaButton padding="p-4">Refresh</SofaButton>
						</div>
						<!-- questions -->
						<div class="grid gap-6">
							<div v-for="question in questions" :key="question.id" class="bg-lightGray rounded-lg px-2 py-4">
								<div class="flex items-center justify-between cursor-pointer" @click="toggleOptions(question.id)">
									<SofaText :content="question.question" size="sub" />
									<SofaIcon
										name="angle-small-down"
										class="h-[7px] transition"
										:class="question.isVisible ? 'rotate-180' : 'rotate-0'" />
									<SofaButton padding="py-2 px-3">Add</SofaButton>
								</div>
								<div v-if="question.isVisible">
									<div
										v-for="(option, index) in question.options"
										:key="option"
										class="bg-white p-2 rounded-lg mt-2 flex items-center gap-2">
										<SofaIcon :name="optionIcons[index]" class="h-[15px]" />
										<SofaText :content="option" size="sub" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
				<!-- BUTTONS FOR WATCHING DOCUMENT STATE -->
				<div
					v-if="type === 'document' || type === 'topic'"
					class="w-full flex gap-4 justify-center mdlg:justify-between items-center p-4 mdlg:p-6">
					<SofaButton v-if="$screen.desktop" padding="py-3 px-3" color="gray">Back</SofaButton>
					<SofaButton padding="py-3 px-3" :class="{ 'w-full': !$screen.desktop }">Continue</SofaButton>
				</div>
			</SofaModal>
		</template>
	</FullLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Media } from '@modules/core'
// import { VueDraggable, DraggableEvent } from 'vue-draggable-plus'
// import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
const route = useRoute()
const type = computed(() => route.query.type)
const file = ref<Media | null>(null)
const isLoading = ref(false)
const isDragging = ref(false)
const createQuizTypes = ref([
	{
		value: 'document',
		icon: 'question-from-document' as IconName,
		title: 'Get questions from a document',
		description: 'AI generated',
	},
	{
		value: 'topic',
		icon: 'question-from-topic' as IconName,
		title: 'Get questions from a topic',
		description: 'AI generated',
	},
	{
		value: 'scratch',
		icon: 'question-from-scratch' as IconName,
		title: 'Create questions from scratch',
		description: 'Type your questions',
	},
])

const scrapPdf = async (media: Media) => {
	console.log('media', media) // Log media to check its type
	isLoading.value = true

	if (media.size > 50 * 1024 * 1024) {
		alert('File size exceeds 50MB')
		isLoading.value = false
		return
	}

	// const doc = await pdfjs.getDocument(media.data).promise
	// const pages = doc.numPages
	// console.log('pages', pages)
	file.value = media
	isLoading.value = false
}

const handleDrop = () => {
	isDragging.value = false
}

const questions = ref([
	{
		id: 1,
		question: 'The currency used in granting credits to the member countries IMF is',
		options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
		isVisible: false,
	},
	{
		id: 2,
		question: 'The currency used in granting credits to the member countries IMF is',
		options: ['Option A', 'Option B', 'Option C', 'Option D'],
		isVisible: false,
	},
])

const optionIcons = ref<IconName[]>(['q-circle', 'q-triangle', 'q-square', 'q-kite'])

const toggleOptions = (id: number) => {
	const question = questions.value.find((q) => q.id === id)
	if (question) {
		question.isVisible = !question.isVisible
	}
}
</script>
