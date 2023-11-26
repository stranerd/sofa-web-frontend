<template>
	<div class="w-full flex shadow-custom mdlg:bg-white rounded-2xl justify-between flex-grow h-full flex-col">
		<div class="w-full flex p-4 rounded-t-2xl gap-3 items-center justify-between border-b border-[#E1E6EB]">
			<div class="flex flex-row items-center gap-3">
				<sofa-icon class="mdlg:hidden" customClass="h-[15px]" :name="'back-arrow'" @click="Logic.Common.goBack()" />
				<sofa-avatar :photoUrl="data.photoUrl ?? ''" :size="Logic.Common.isLarge ? '40' : '34'" :bgColor="'bg-grayColor'">
					<sofa-icon :customClass="'h-[23px]'" :name="'user'" v-if="!data.photoUrl" />
				</sofa-avatar>
				<div class="flex flex-col">
					<sofa-custom-input v-model="title"
						:customClass="'!font-bold w-full flex justify-start !px-0 !py-0 !text-sm mdlg:!text-base'"
						@onContentChange="submitTitle" @onBlur="editTitle = false" :autoFocus="true"
						v-if="canEditTitle && editTitle"></sofa-custom-input>
					<sofa-normal-text v-else @click="editTitle = canEditTitle"
						:customClass="'!font-bold w-full !text-sm mdlg:!text-base'">
						{{ data.title }}
					</sofa-normal-text>
					<sofa-normal-text :color="'text-grayColor'" :customClass="'!text-[12px]'">
						{{ data.userNames.join(', ') }}
					</sofa-normal-text>
				</div>
			</div>
			<slot v-if="!editTitle" name="top-extras" />
		</div>

		<div class="w-full bg-white flex flex-col items-start justify-start gap-2 h-full flex-grow overflow-y-auto px-4 py-2">
			<slot />
		</div>

		<div class="w-full px-4 py-2 bg-white mdlg:border-t mdlg:border-[#E1E6EB]">
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
		required: true
	},
	canEditTitle: {
		type: Boolean,
		required: false,
		default: false
	},
	updateTitle: {
		type: Function as PropType<(title: string) => Promise<void>>,
		required: false
	}
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

watch(title, () => {
	emits('update:modelValue', title.value)
})
</script>