<template>
	<!-- create item action -->
	<sofa-modal :close="() => close?.()" :can-close="true">
		<div class="mdlg:!w-[60%] lg:!w-[50%] mdlg:!h-full w-full h-auto md:w-[70%] flex flex-col items-center relative">
			<div
				class="bg-white w-full flex flex-col lg:!px-6 md:!gap-4 gap-1 lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center">
				<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
					<sofa-header-text :custom-class="'text-xl'" content="Save to" />
				</div>

				<div
					class="w-full flex justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-lightGray border-b px-4">
					<sofa-normal-text :custom-class="'!font-bold !text-base'"> Save to </sofa-normal-text>
					<sofa-icon :custom-class="'h-[19px]'" :name="'circle-close'" @click="close?.()" />
				</div>

				<div class="w-full flex flex-col gap-3 px-4 py-4">
					<a
						v-for="item in folders"
						:key="item.id"
						class="w-full flex items-center gap-3 justify-between p-4 rounded-custom bg-lightGray">
						<div class="flex items-center w-full gap-3">
							<sofa-icon :name="'folder'" :custom-class="'h-[18px]'" />

							<sofa-custom-input
								v-if="item.id === factory.entityId"
								v-model="factory.title"
								:custom-class="`lg:text-sm mdlg:text-[12px] text-xs w-full  cursor-text !bg-white`"
								placeholder="Folder name"
								@onBlur="saveFolder"
								@onEnter="saveFolder" />

							<sofa-normal-text v-else class="truncate w-full">
								{{ item.title }}
							</sofa-normal-text>
						</div>

						<div class="flex items-center flex-shrink-0">
							<SofaNormalText
								v-if="[...item.saved.courses, ...item.saved.quizzes].includes(material.id)"
								color="text-primaryRed"
								as="a"
								content="- Remove"
								@click="handleFolderSelected(item.id, false)" />
							<SofaNormalText v-else color="text-primaryBlue" as="a" content="+ Add" @click="handleFolderSelected(item.id)" />
						</div>
					</a>
					<a class="w-full flex items-center gap-3 p-4 rounded-custom bg-lightGray" @click="generateNewFolder">
						<sofa-icon :custom-class="'h-[18px]'" :name="'add-card'" />
						<sofa-normal-text :custom-class="'text-grayColor'"> Add new folder </sofa-normal-text>
					</a>
				</div>
			</div>
		</div>
	</sofa-modal>
</template>

<script lang="ts" setup>
import { useEditFolder, useMyFolders } from '@/composables/study/folders'
import { FolderSaved } from '@modules/study'
import { SofaCustomInput, SofaHeaderText, SofaIcon, SofaModal, SofaNormalText } from 'sofa-ui-components'
import { defineProps } from 'vue'

const props = defineProps({
	close: {
		type: Function,
		default: null,
	},
	material: {
		type: Object,
		required: true,
	},
})

const { folders, saveItem } = useMyFolders()
const { factory, saveFolder, generateNewFolder } = useEditFolder()

const handleFolderSelected = (folderId: string, add = true) => {
	if (props.material)
		saveItem(folderId, {
			type: props.material.type === 'course' ? FolderSaved.courses : FolderSaved.quizzes,
			values: [props.material.id],
			add,
		})
}
</script>
