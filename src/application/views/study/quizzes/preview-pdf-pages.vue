<template>
	<FullLayout :hide="{ left: true, right: true }">
		<template #middle-session>
			<SofaModal>
				<div class="max-w-2xl mx-auto p-4">
					<div class="mb-4">
						<SofaText content="Upload Document" class="mb-4" />
						<SofaFileInput
							accept="application/pdf"
							class="bg-primaryBlue p-3 rounded-md text-white"
							@update:modelValue="(media) => media && handleFileUpload(media as Media)"
						>Upload</SofaFileInput
						>
					</div>

					<div v-if="error" class="text-primaryRed">
						{{ error }}
					</div>

					<div v-if="isLoading" class="text-primaryBlue">Loading PDF...</div>

					<!-- Page Selection -->
					<div v-if="totalPages > 0" class="mb-4">
						<SofaHeading content="Page Selection" />
						<div class="flex items-center space-x-4">
							<div>
								<SofaText content=" Start Page" as="label" />
								<SofaInput v-model.number="startPage" type="number" :min="1" :max="totalPages" />
							</div>
							<div>
								<SofaText content=" End Page" as="label" />
								<SofaInput v-model.number="endPage" type="number" :min="1" :max="totalPages" />
							</div>
						</div>
					</div>

					<!-- PDF Preview -->
					<div v-if="pagesPreviews.length > 0" class="border rounded-lg p-4">
						<SofaHeading content="Pdf Preview" />
						<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
							<div v-for="({ imageSrc, id }, index) in pagesPreviews" :key="id" class="border rounded-lg p-2">
								<img :src="imageSrc" class="w-full" :alt="`Page ${startPage + index}`" />
								<div class="flex items-center gap-3">
									<SofaCheckbox
										:modelValue="selectedPages.includes(index + startPage)"
										@update:modelValue="updateSelectedPages(index + startPage, $event)">
										Page {{ index + startPage }}
									</SofaCheckbox>
								</div>
							</div>
						</div>
					</div>

					<!-- Text contet -->
					<div v-if="pageTexts" class="border rounded-lg p-4">
						<SofaHeading content="Text Preview" />
						<div v-for="(text, page) in pageTexts" :key="page" class="border rounded-lg p-2">
							<div class="flex items-center gap-3">
								<SofaText :content="`Page ${page}`" />
								<SofaText :content="text" />
							</div>
						</div>
					</div>
				</div>
			</SofaModal>
		</template>
	</FullLayout>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import { Media } from '@modules/core'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const isLoading = ref(false)
const error = ref<string | null>(null)
const pdfDocumentLoaded = ref(false)
const totalPages = ref(0)
const startPage = ref(1)
const endPage = ref(1)
const pagesPreviews = ref<{ id: number; imageSrc: string }[]>([])
const selectedPages = ref<number[]>([])
const pageTexts = ref<{ [key: number]: string }>({})

// Use a non-reactive variable to store the PDF document
let pdfDocument: any = null

const handleFileUpload = async (media: Media) => {
	if (!media.type.includes('pdf')) {
		error.value = 'Please upload a PDF file'
		return
	}

	try {
		isLoading.value = true
		error.value = null

		// Fetch the file content using the link provided in the Media object
		const response = await fetch(media.link)
		const arrayBuffer = await response.arrayBuffer()

		const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer))
		pdfDocument = await loadingTask.promise

		totalPages.value = pdfDocument.numPages
		endPage.value = totalPages.value
		pdfDocumentLoaded.value = true
	} catch (err) {
		console.error('Error loading PDF:', err)
		error.value = 'Failed to load the PDF file. Please try again.'
	} finally {
		isLoading.value = false
	}
}

const generatePreviews = async () => {
	if (!pdfDocument) return
	try {
		const newPreviews = []

		for (let i = startPage.value; i <= endPage.value; i++) {
			const page = await pdfDocument.getPage(i)
			const scale = 1.5
			const viewport = page.getViewport({ scale })

			const canvas = document.createElement('canvas')
			const context = canvas.getContext('2d')
			canvas.height = viewport.height
			canvas.width = viewport.width

			const renderContext = {
				canvasContext: context,
				viewport: viewport,
			}

			await page.render(renderContext).promise
			newPreviews.push({
				id: i,
				imageSrc: canvas.toDataURL(),
			})
		}
		pagesPreviews.value = newPreviews
	} catch (err) {
		console.error('Error generating previews:', err)
		error.value = 'Failed to generate page previews'
	}
}

const updateSelectedPages = (page: number, isChecked: boolean | boolean[]) => {
	if (isChecked && !selectedPages.value.includes(page)) {
		selectedPages.value.push(page)
	} else if (!isChecked) {
		selectedPages.value = selectedPages.value.filter((p) => p !== page)
	}
}

const extractTextFromPage = async (pageNumber: number) => {
	if (!pdfDocument) {
		console.error('PDF document not loaded')
		return ''
	}

	try {
		const page = await pdfDocument.getPage(pageNumber)
		const textContent = await page.getTextContent()
		return textContent.items.map((item: any) => item.str).join(' ')
	} catch (error) {
		console.error(`Error extracting text from page ${pageNumber}:`, error)
		return ''
	}
}

watchEffect(async () => {
	const currentSelectedPages = new Set(selectedPages.value)

	// Remove text content for deselected pages
	for (const page in pageTexts.value) {
		if (!currentSelectedPages.has(Number(page))) {
			delete pageTexts.value[Number(page)]
		}
	}

	// Add text content for newly selected pages
	for (const page of currentSelectedPages) {
		if (!pageTexts.value[page]) {
			try {
				pageTexts.value[page] = await extractTextFromPage(page)
			} catch (error) {
				console.error(`Error extracting text from page ${page}:`, error)
			}
		}
	}
})

watchEffect(async () => {
	if (pdfDocumentLoaded.value && startPage.value <= endPage.value) {
		await generatePreviews()
	}
})
</script>
