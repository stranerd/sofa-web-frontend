<template>
	<div class="w-full flex flex-col">
		<div class="w-full flex justify-between items-center sticky top-0 left-0 md:hidden py-2 px-4 border-lightGray border-b">
			<sofa-normal-text :custom-class="'!font-bold !text-base'">Options</sofa-normal-text>
			<sofa-icon :custom-class="'h-[19px]'" :name="'circle-close'" @click="close" />
		</div>

		<a v-for="item in moreOptions" :key="item.title" class="w-full flex items-center gap-2 p-4" @click.stop.prevent="item.action()">
			<sofa-icon :name="item.icon" :class="item.icon === 'delete-quiz' ? 'fill-primaryRed h-[18px]' : 'h-[15px]'" />
			<sofa-normal-text :custom-class="item.icon === 'delete-quiz' ? '!text-primaryRed' : ''">
				{{ item.title }}
			</sofa-normal-text>
		</a>
	</div>
</template>

<script lang="ts" setup>
import { useOrganizationModal } from '@app/composables/core/modals'
import { useDeleteClass } from '@app/composables/organizations/classes'
import { ClassEntity } from '@modules/organizations'
import { Logic } from 'sofa-logic'
import { defineProps } from 'vue'

const props = defineProps<{
	classInst: ClassEntity
	close: () => void
}>()

const { deleteClass } = useDeleteClass()

const moreOptions = [
	{
		icon: 'edit-option',
		title: 'Edit',
		action: () => {
			useOrganizationModal().editClass.open({
				organizationId: props.classInst.organizationId,
				classInst: props.classInst,
			})
			props.close()
		},
	},
	{
		icon: 'share-option',
		title: 'Share',
		action: () => {
			Logic.Common.share(`Join ${props.classInst.title} class on SOFA`, props.classInst.description, props.classInst.shareLink)
			props.close()
		},
	},
	{
		icon: 'delete-quiz',
		title: 'Delete',
		action: async () => {
			await deleteClass(props.classInst)
			props.close()
		},
	},
]
</script>
