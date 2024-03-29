<template>
	<div :class="`flex w-full flex-col gap-2 ${customClass}`">
		<template v-if="isWrapper">
			<a class="flex flex-row flex-wrap w-full relative" @click="openFileSelect">
				<div class="w-full flex flex-col justify-center items-center">
					<slot name="content" />
				</div>
			</a>
		</template>
		<template v-else>
			<a
				class="rounded flex flex-row items-center justify-start relative gap-2 px-1 py-4 bg-grayBackground border-dashed"
				@click="openFileSelect">
				<SofaIcon :name="iconName" customClass="h-[15px]" />
				<SofaNormalText color="text-paragraphTextLight" customClass="w-full text-left line-clamp-1">
					{{ selectedFileName != '' ? selectedFileName : placeholder }}
				</SofaNormalText>
			</a>
		</template>
		<input ref="fileInput" type="file" class="hidden" :accept="accept" :multiple="isMultiple" @change="uploadHandler" />
	</div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import SofaIcon from '../SofaIcon/index.vue'
import SofaNormalText from '../SofaTypography/normalText.vue'

const props = withDefaults(
	defineProps<{
		placeholder?: string
		iconName?: IconName
		accept?: string
		isWrapper?: boolean
		isMultiple?: boolean
		customClass?: string
	}>(),
	{
		placeholder: 'Upload File',
		iconName: 'upload',
		accept: '*',
		isWrapper: false,
		isMultiple: false,
		customClass: '',
	},
)

const fileInput = ref(null as HTMLInputElement | null)
const openFileSelect = async () => {
	if (fileInput.value) fileInput.value.value = null as any
	fileInput.value?.click()
}
const files = ref<FileList>()
const selectedFileName = ref('')
const model = defineModel<any>({ default: null })
const localFileUrl = defineModel<string>('localFileUrl', { default: '' })
const base64Data = defineModel<string>('base64Data', { default: '' })

const fileListArray = ref<any[]>(model.value ?? [])

const toDataURL = (url: string, callback: any) => {
	const xhr = new XMLHttpRequest()
	xhr.onload = function () {
		const reader = new FileReader()
		reader.onloadend = function () {
			callback(reader.result)
		}
		reader.readAsDataURL(xhr.response)
	}
	xhr.open('GET', url)
	xhr.responseType = 'blob'
	xhr.send()
}

const uploadHandler = (e: any) => {
	const input = e.target

	if (props.isMultiple) {
		files.value = input.files
	} else {
		files.value = input.files

		selectedFileName.value = input.files[0].name

		// create readable url
		const fr = new FileReader()
		if (files.value) {
			fr.readAsDataURL(files.value[0])
			fr.addEventListener('load', () => {
				localFileUrl.value = fr.result?.toString() ? fr.result?.toString() : ''
				toDataURL(fr.result?.toString() || '', (dataUrl: any) => {
					base64Data.value = dataUrl
				})
			})
		}
	}
}

watch(files, () => {
	if (files.value) {
		fileListArray.value = []
		for (let index = 0; index < files.value.length; index++) {
			const file = files.value?.item(index)
			fileListArray.value.push(file)
		}
		model.value = props.isMultiple ? fileListArray.value : fileListArray.value[0]
	}
})

watch(props, () => {
	if (props.placeholder) {
		selectedFileName.value = ''
	}
})
</script>
