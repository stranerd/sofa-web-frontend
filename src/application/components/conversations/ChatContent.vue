<template>
	<div class="w-full flex shadow-custom mdlg:bg-white rounded-2xl justify-between grow h-full flex-col">
		<div class="w-full flex p-4 rounded-t-2xl gap-3 items-center justify-between border-b border-darkLightGray text-left">
			<div class="flex items-center gap-3 flex-1">
				<SofaIcon class="mdlg:hidden" customClass="h-[15px]" name="back-arrow" @click="Logic.Common.goBack()" />
				<SofaAvatar :photoUrl="data.photoUrl" :size="Logic.Common.isLarge ? '40' : '34'" />
				<div class="flex flex-col">
					<SofaCustomInput
						v-if="canEditTitle && editTitle"
						v-model="title"
						customClass="!font-bold w-full flex justify-start !px-0 !py-0 !text-sm mdlg:!text-base"
						:autoFocus="true"
						@onContentChange="submitTitle"
						@onBlur="editTitle = false"></SofaCustomInput>
					<SofaNormalText
						v-else
						class="!font-bold w-full !text-sm mdlg:!text-base !line-clamp-1"
						:content="data.title"
						@click="editTitle = canEditTitle ?? false" />
					<SofaNormalText class="!text-[12px] line-clamp-1" :content="data.userNames.join(', ')" />
				</div>
			</div>
			<slot v-if="!editTitle" name="top-extras" />
		</div>

		<div class="w-full bg-white flex flex-col items-start justify-start gap-2 h-full grow overflow-y-auto px-4 py-2">
			<slot />
		</div>

		<div class="w-full px-4 py-2 bg-white mdlg:border-t mdlg:border-darkLightGray">
			<slot name="bottom" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Logic } from 'sofa-logic'

const props = defineProps<{
	data: {
		title: string
		photoUrl: string | null
		userNames: string[]
	}
	canEditTitle?: boolean
	updateTitle?: (title: string) => Promise<void>
}>()

const model = defineModel<string>({ default: '' })

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
		model.value = title.value
	},
	{ immediate: true },
)
</script>
