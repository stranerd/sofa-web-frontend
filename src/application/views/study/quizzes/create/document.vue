<template>
	<QuizCreateLayout
		:title="state === 'questions' ? 'Add questions' : state === 'preview' ? 'Choose pages' : 'Add document'"
		:onBack="state === 'questions' ? () => (state = 'preview') : state === 'preview' ? () => (state = 'select') : undefined">
		<template v-if="state === 'select'">
			<div class="w-full m-auto rounded-lg flex flex-col justify-center items-center text-center gap-2 px-6 py-12 bg-lightGray">
				<span class="bg-white p-3 rounded-full size-[50px] flex justify-center items-center mb-2">
					<SofaIcon name="upload" class="h-[20px] fill-current" />
				</span>
				<SofaHeading size="title">Upload</SofaHeading>
				<SofaText content="Questions will be generated from the document you pick" class="text-grayColor" />
				<SofaText content="Max file size - 50MB | Max page limit - 50" class="text-grayColor" size="sub" />
				<SofaFileInput v-model="factory.document" accept="application/pdf, text/plain" class="mt-2">
					<SofaButton padding="py-4 px-3" class="max-w-full">Choose from device</SofaButton>
				</SofaFileInput>
				<SofaText v-if="factory.document" :content="factory.document.name" clamp />
			</div>
			<SofaButton padding="p-3" class="w-full mt-auto" :disabled="!factory.isValid('document')" @click="loadPreviews"
			>Continue</SofaButton
			>
		</template>
		<template v-if="state === 'preview'"> </template>
		<template v-if="state === 'questions'">
			<AiGen :factory="factory" />
		</template>
	</QuizCreateLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAsyncFn } from '@app/composables/core/hooks'
import { AiGenFactory } from '@modules/study'
import { generatePreview } from '@utils/previews'

export default defineComponent({
	name: 'StudyQuizzesCreateDocumentPage',
	routeConfig: {
		goBackRoute: '/study/quizzes/create',
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const state = ref<'select' | 'preview' | 'questions'>('select')
		const factory = new AiGenFactory('document')

		const { asyncFn: loadPreviews } = useAsyncFn(async () => {
			const document = factory.document
			if (!document) return
			factory.previews.value = await generatePreview(document)
			state.value = 'preview'
		})

		return { state, factory, loadPreviews }
	},
})
</script>
