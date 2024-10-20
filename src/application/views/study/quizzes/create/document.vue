<template>
	<QuizCreateLayout :title="showPreview ? 'Add questions' : 'Add document'">
		<div class="w-full m-auto rounded-lg flex flex-col justify-center items-center text-center gap-2 px-6 py-12 bg-lightGray">
			<span class="bg-white p-3 rounded-full size-[50px] flex justify-center items-center mb-2">
				<SofaIcon name="upload" class="h-[20px] fill-current" />
			</span>
			<SofaHeading size="title">Upload</SofaHeading>
			<SofaText content="Questions will be generated from the document you pick" class="text-grayColor" />
			<SofaText content="Max file size - 50MB | Max page limit - 50" class="text-grayColor" size="sub" />
			<SofaFileInput accept="application/pdf, text/plain" class="mt-2">
				<SofaButton padding="py-4 px-3">{{ 'Choose from device' }}</SofaButton>
			</SofaFileInput>
		</div>
		<SofaButton padding="py-3 px-3" class="w-full mt-auto">Continue</SofaButton>
	</QuizCreateLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'StudyQuizzesCreateDocumentPage',
	routeConfig: {
		goBackRoute: '/study/quizzes/create',
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const showPreview = ref(false)
		return { showPreview }
	},
})
</script>
