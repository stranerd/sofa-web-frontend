<template>
	<FullLayout :hide="{ left: true, right: true }">
		<template #middle-session>
			<SofaModal>
				<div class="max-w-6xl mx-auto p-4">
					<div class="mb-4">
						<SofaText content="Upload Document" class="mb-4" />
						<SofaFileInput
							accept=".txt,.docx"
							class="bg-primaryBlue p-3 rounded-md text-white"
							@update:modelValue="(media) => media && handleFileUpload(media as Media)">
							Upload
						</SofaFileInput>
						<SofaText :content="fileName" class="mt-4 text-grayColor font-light" />
					</div>

					<div v-if="error" class="text-primaryRed mb-4">
						{{ error }}
					</div>
					<div v-if="isLoading" class="text-primaryBlue mb-4">Loading...</div>

					<template v-if="!error && !isLoading && fileName">
						<!-- Tabs -->
						<div class="mb-4">
							<div class="flex space-x-4 border-b">
								<button
									v-for="tab in tabs"
									:key="tab"
									:class="[
										'py-2 px-4',
										currentTab === tab ? 'border-b-2 border-primaryBlue text-primaryBlue' : 'text-gray-500',
									]"
									@click="currentTab = tab">
									{{ tab }}
								</button>
							</div>
						</div>

						<!-- Page Selection with Previews -->
						<div v-if="currentTab === 'Pages'" class="mb-4">
							<SofaHeading content="Page Selection" />
							<div class="grid grid-cols-5 gap-4 mt-4">
								<div v-for="(page, index) in pages" :key="index" class="border rounded-lg p-2">
									<div class="flex flex-col items-center">
										<canvas
											:ref="
												(el) => {
													if (el) canvasRefs[index] = el as HTMLCanvasElement
												}
											"
											class="w-full h-40 border rounded mb-2">
										</canvas>
										<SofaCheckbox
											:modelValue="selectedPages.includes(index)"
											@update:modelValue="togglePageSelection(index)">
											Page {{ index + 1 }}
										</SofaCheckbox>
									</div>
								</div>
							</div>
						</div>

						<!-- Text Content -->
						<div v-else-if="currentTab === 'Text Content'" class="mb-4">
							<SofaHeading content="Selected Pages Content" />
							<div class="mt-4">
								<div v-for="index in selectedPages" :key="index" class="mb-4 border rounded-lg p-4">
									<SofaText :content="`Page ${index + 1}`" class="font-bold mb-2" />
									<SofaText :content="pages[index]" />
								</div>
							</div>
						</div>
					</template>
				</div>
			</SofaModal>
		</template>
	</FullLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import mammoth from 'mammoth'
import { Media } from '@modules/core'

const error = ref('')
const isLoading = ref(false)
const fileName = ref('')
const pages = ref<string[]>([])
const selectedPages = ref<number[]>([])
const currentTab = ref<'Pages' | 'Text Content'>('Pages')
const canvasRefs = ref<Record<number, HTMLCanvasElement>>({})

const tabs = ['Pages', 'Text Content'] as const
const MAX_PAGES = 50
const MAX_FILE_SIZE = 50 * 1024 * 1024
const CHARS_PER_A4_PAGE = 3000

const readFile = async (url: string, type: 'text' | 'docx') => {
	const response = await fetch(url)
	if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

	let content: string
	if (type === 'text') {
		content = await response.text()
	} else {
		const arrayBuffer = await response.arrayBuffer()
		const result = await mammoth.extractRawText({ arrayBuffer })
		content = result.value
	}

	// Split the content into A4-sized pages
	const pages: string[] = []
	let currentPage = ''
	const words = content.split(/\s+/)

	for (const word of words) {
		if ((currentPage + word).length > CHARS_PER_A4_PAGE) {
			pages.push(currentPage.trim())
			currentPage = ''
		}
		currentPage += word + ' '
	}
	if (currentPage.trim()) {
		pages.push(currentPage.trim())
	}

	return pages
}

const togglePageSelection = (index: number) => {
	const selectedIndex = selectedPages.value.indexOf(index)
	if (selectedIndex === -1) {
		selectedPages.value.push(index)
	} else {
		selectedPages.value.splice(selectedIndex, 1)
	}
}

const renderPagePreview = (pageIndex: number) => {
	const canvas = canvasRefs.value[pageIndex]
	if (!canvas) return

	const ctx = canvas.getContext('2d')
	if (!ctx) return

	canvas.width = 200
	canvas.height = 283

	const text = pages.value[pageIndex] || ''
	const lines = text.split('\n')

	lines.slice(0, 30).forEach((line, index) => {
		ctx.fillText(line.slice(0, 30) + (line.length > 30 ? '...' : ''), 5, 10 + index * 9)
	})
}

const handleFileUpload = async (media: Media) => {
	try {
		isLoading.value = true
		error.value = ''
		fileName.value = ''

		if (media.size > MAX_FILE_SIZE) {
			throw new Error('File size exceeds 50MB limit')
		}

		pages.value = await readFile(media.link, media.name.endsWith('.txt') ? 'text' : 'docx')

		if (pages.value.length > MAX_PAGES) {
			throw new Error('Document exceeds 50 pages limit')
		}

		fileName.value = media.name
		selectedPages.value = []
		currentTab.value = 'Pages'

		setTimeout(() => {
			pages.value.forEach((_, index) => renderPagePreview(index))
		}, 0)
	} catch (err: any) {
		error.value = err.message
	} finally {
		isLoading.value = false
	}
}
</script>
