<template>
	<div class="w-full flex flex-col mdlg:p-6 md:gap-4 gap-1 md:p-4">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeaderText class="text-xl" content="Save to" />
		</div>

		<div class="w-full flex justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-lightGray border-b px-4">
			<SofaNormalText class="!font-bold !text-base" content="Save to" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex flex-col gap-3 px-4 py-4">
			<a
				v-for="item in folders"
				:key="item.id"
				class="w-full flex items-center gap-3 justify-between p-4 rounded-custom bg-lightGray">
				<div class="flex items-center w-full gap-3">
					<SofaIcon name="folder" customClass="h-[18px]" />

					<SofaCustomInput
						v-if="item.id === factory.entityId"
						v-model="factory.title"
						customClass="lg:text-sm mdlg:text-[12px] text-xs w-full  cursor-text !bg-white"
						placeholder="Folder name"
						@onBlur="saveFolder"
						@onEnter="saveFolder" />

					<SofaNormalText v-else class="truncate w-full" :content="item.title" />
				</div>

				<div class="flex items-center flex-shrink-0">
					<SofaNormalText
						v-if="[...item.saved.courses, ...item.saved.quizzes].includes(id)"
						color="text-primaryRed"
						as="a"
						content="- Remove"
						@click="handleFolderSelected(item.id, false)" />
					<SofaNormalText v-else color="text-primaryBlue" as="a" content="+ Add" @click="handleFolderSelected(item.id, true)" />
				</div>
			</a>
			<a class="w-full flex items-center gap-3 p-4 rounded-custom bg-lightGray" @click="generateNewFolder">
				<SofaIcon class="h-[18px]" name="add-card" />
				<SofaNormalText class="text-grayColor" content="Add new folder" />
			</a>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useEditFolder, useMyFolders } from '@app/composables/study/folders'
import { FolderSaved } from '@modules/study'

const props = defineProps<{
	close: () => void
	id: string
	type: FolderSaved
}>()

const { folders, saveItem } = useMyFolders()
const { factory, saveFolder, generateNewFolder } = useEditFolder()

const handleFolderSelected = (folderId: string, add: boolean) =>
	saveItem(folderId, {
		type: props.type,
		values: [props.id],
		add,
	})
</script>
