<template>
	<div class="w-full flex flex-col">
		<div class="w-full flex justify-between items-center sticky top-0 left-0 md:hidden py-2 px-4 border-lightGray border-b">
			<SofaNormalText customClass="!font-bold !text-base">Options</SofaNormalText>
			<SofaIcon customClass="h-[19px]" name="circle-close" @click="close" />
		</div>

		<a v-for="item in moreOptions" :key="item.title" class="w-full flex items-center gap-2 p-4" @click.stop.prevent="item.action()">
			<SofaIcon :name="item.icon" :class="item.icon === 'delete-quiz' ? 'fill-primaryRed h-[18px]' : 'h-[15px]'" />
			<SofaNormalText :customClass="item.icon === 'delete-quiz' ? '!text-primaryRed' : ''">
				{{ item.title }}
			</SofaNormalText>
		</a>
	</div>
</template>

<script lang="ts" setup>
import { useModals } from '@app/composables/core/modals'
import { useDeleteClass } from '@app/composables/organizations/classes'
import { ClassEntity } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
	close: () => void
}>()

const { deleteClass } = useDeleteClass()

const moreOptions = [
	{
		icon: 'edit-option' as const,
		title: 'Edit',
		action: () => {
			useModals().organizations.editClass.open({
				organizationId: props.classInst.organizationId,
				classInst: props.classInst,
			})
			props.close()
		},
	},
	{
		icon: 'share-option' as const,
		title: 'Share',
		action: () => {
			$utils.share(`Join ${props.classInst.title} class on SOFA`, props.classInst.description, props.classInst.shareLink)
			props.close()
		},
	},
	{
		icon: 'delete-quiz' as const,
		title: 'Delete',
		action: async () => {
			await deleteClass(props.classInst)
			props.close()
		},
	},
]
</script>
