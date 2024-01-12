<template>
	<div class="w-full flex shadow-custom mdlg:bg-white rounded-2xl justify-between flex-grow h-full flex-col">
		<div class="w-full flex p-4 rounded-t-2xl gap-3 items-center justify-between border-b border-darkLightGray text-left">
			<div class="flex items-center gap-3 flex-1">
				<sofa-icon class="mdlg:hidden" custom-class="h-[15px]" :name="'back-arrow'" @click="Logic.Common.goBack()" />
				<sofa-avatar :photo-url="data.photoUrl" :size="Logic.Common.isLarge ? '40' : '34'" />
				<div class="flex flex-col w-full">
					<sofa-custom-input
						v-if="canEditTitle && editTitle"
						v-model="title"
						:custom-class="'!font-bold w-full flex justify-start !px-0 !py-0 !text-sm mdlg:!text-base'"
						:auto-focus="true"
						@on-content-change="submitTitle"
						@on-blur="editTitle = false"></sofa-custom-input>
					<SofaNormalText
						v-else
						class="!font-bold w-full !text-sm mdlg:!text-base line-clamp-1"
						:content="data.title"
						@click="editTitle = canEditTitle" />
					<SofaNormalText class="!text-[12px] line-clamp-1" :content="data.userNames.join(', ')" />
				</div>
			</div>
			<slot v-if="!editTitle" name="top-extras" />
		</div>

		<div class="w-full bg-white flex flex-col items-start justify-start gap-2 h-full flex-grow overflow-y-auto px-4 py-2">
			<slot />
		</div>

		<div class="w-full px-4 py-2 bg-white mdlg:border-t mdlg:border-darkLightGray">
			<slot name="bottom" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { Logic } from 'sofa-logic'
import { SofaAvatar, SofaCustomInput, SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { defineEmits, defineProps, PropType, ref, watch } from 'vue'

const props = defineProps({
	data: {
		type: Object as PropType<{
			title: string
			photoUrl: string | null
			userNames: string[]
		}>,
		required: true,
	},
	canEditTitle: {
		type: Boolean,
		required: false,
		default: false,
	},
	updateTitle: {
		type: Function as PropType<(title: string) => Promise<void>>,
		required: false,
		default: null,
	},
})

const emits = defineEmits(['update:modelValue'])

const editTitle = ref(false)
const title = ref(props.data.title)

const submitTitle = () => {
	Logic.Common.debounce(async () => {
		props.updateTitle?.(title.value)
	}, 700)
	editTitle.value = false
}

watch(
	title,
	() => {
		emits('update:modelValue', title.value)
	},
	{ immediate: true },
)
</script>
