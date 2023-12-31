<template>
	<div :class="`flex w-full flex-col gap-2 ${customClass}`">
		<template v-if="isWrapper">
			<div class="flex flex-row flex-wrap w-full relative">
				<input
					type="file"
					:style="`
            opacity: 0;
            width: 100%;
            height: 100%;
            left: 0;
            overflow: hidden;
            position: absolute;
            z-index: 100;
          `"
					:accept="accept"
					:multiple="isMultiple"
					@change="uploadHandler" />
				<div class="w-full flex flex-col justify-center items-center">
					<slot name="content" />
				</div>
			</div>
		</template>
		<template v-else>
			<div class="rounded flex flex-row items-center justify-start relative gap-2 px-1 py-4 bg-grayBackground border-dashed">
				<input
					type="file"
					style="opacity: 0; width: 100%; height: 100%; left: 0; overflow: hidden; position: absolute; z-index: 10"
					:accept="accept"
					:multiple="isMultiple"
					@change="uploadHandler" />
				<sofa-icon :name="`${iconName}`" :custom-class="'h-[15px]'" />
				<sofa-normal-text color="text-paragraphTextLight" custom-class="w-full text-left line-clamp-1">
					{{ selectedFileName != '' ? selectedFileName : placeholder }}
				</sofa-normal-text>
			</div>
		</template>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import SofaIcon from '../SofaIcon/index.vue'
import SofaNormalText from '../SofaTypography/normalText.vue'

export default defineComponent({
	name: 'SofaFileAttachment',
	components: {
		SofaNormalText,
		SofaIcon,
	},
	props: {
		placeholder: {
			type: String,
			default: 'Upload File',
		},
		iconName: {
			type: String,
			default: 'upload',
		},
		accept: {
			type: String,
			default: '*',
		},
		modelValue: {
			type: Object,
			required: false,
			default: null,
		},
		isWrapper: {
			type: Boolean,
			default: false,
		},
		isMultiple: {
			type: Boolean,
			default: false,
		},
		customClass: {
			type: String,
			default: '',
		},
	},
	emits: ['update:modelValue', 'update:localFileUrl', 'update:base64Data'],
	setup(props: any, context: any) {
		const files = ref<FileList>()

		const selectedFileName = ref('')

		const fileListArray = ref<any[]>([])

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
						context.emit('update:localFileUrl', fr.result?.toString() ? fr.result?.toString() : '')
						toDataURL(fr.result?.toString() || '', (dataUrl: any) => {
							context.emit('update:base64Data', dataUrl)
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
				context.emit('update:modelValue', props.isMultiple ? fileListArray.value : fileListArray.value[0])
			}
		})

		watch(props, () => {
			if (props.placeholder) {
				selectedFileName.value = ''
			}
		})

		onMounted(() => {
			if (props.modelValue) {
				fileListArray.value = props.modelValue
			}
		})

		const removeFile = (index: number) => {
			fileListArray.value = fileListArray.value.filter((file, fileIndex) => {
				return fileIndex != index
			})
			context.emit('update:modelValue', props.isMultiple ? fileListArray.value : fileListArray.value[0])
		}

		return {
			uploadHandler,
			fileListArray,
			removeFile,
			selectedFileName,
		}
	},
})
</script>
