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
			<SofaButton
				padding="p-3"
				class="mt-auto"
				:class="$screen.desktop ? 'w-auto ml-auto' : 'w-full'"
				:disabled="!factory.isValid('document')"
				@click="loadPreviews">
				Continue
			</SofaButton>
		</template>
		<template v-if="state === 'preview'">
			<div class="w-full flex flex-col items-end gap-4 mdlg:flex-row-reverse mdlg:justify-between mdlg:items-center">
				<SofaCheckbox v-model="factory.selectAll" color="purple" rotate>Select all</SofaCheckbox>
				<div class="flex items-center justify-between gap-2">
					<SofaText content="Select page" size="sub" />
					<SofaInput v-model="factory.selectFrom" type="number" :min="1" class="!size-[40px] !p-2" />
					<SofaText content="to" size="sub" />
					<SofaInput v-model="factory.selectTo" type="number" :min="1" class="!size-[40px] !p-2" />
				</div>
			</div>
			<div class="w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 place-items-center overflow-y-auto">
				<div v-for="(preview, i) in factory.previews" :key="i" class="flex flex-col gap-2">
					<SofaImageLoader :photoUrl="preview.image" class="w-full border border-lightGray" />
					<SofaCheckbox v-model="factory.getPreviewFor(i).selected" color="purple" class="text-grayColor">
						Page {{ i + 1 }}
					</SofaCheckbox>
				</div>
			</div>
			<SofaButton
				padding="p-3"
				class="mt-auto"
				:class="$screen.desktop ? 'w-auto ml-auto' : 'w-full'"
				:disabled="!factory.isValid('selectedPreviews')">
				Continue
			</SofaButton>
		</template>
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
			factory.previews = await generatePreview(document)
			state.value = 'preview'
		})

		return { state, factory, loadPreviews }
	},
})
</script>
