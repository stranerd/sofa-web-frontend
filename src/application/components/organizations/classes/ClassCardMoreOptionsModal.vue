<template>
	<div class="w-full flex flex-col mdlg:min-w-[200px]">
		<div class="w-full flex justify-between items-center sticky top-0 left-0 md:hidden py-2 px-4 border-lightGray border-b">
			<SofaNormalText customClass="!font-bold !text-base">Options</SofaNormalText>
			<SofaIcon customClass="h-[19px]" name="circle-close" @click="close" />
		</div>

		<a
			v-for="item in moreOptions.filter((opt) => !opt.hide)"
			:key="item.title"
			class="w-full flex items-center gap-2 p-4"
			:class="item.icon === 'trash' ? 'text-primaryRed' : 'fill-current'"
			@click.stop.prevent="item.action()">
			<SofaIcon :name="item.icon" class="fill-current" :class="item.icon === 'trash' ? 'h-[18px]' : 'h-[15px]'" />
			<SofaText :content="item.title" />
		</a>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { useDeleteClass } from '@app/composables/organizations/classes'
import { ClassEntity } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
	close: () => void
}>()

const { id } = useAuth()
const { deleteClass } = useDeleteClass()

const moreOptions = computed(
	() =>
		[
			{
				icon: 'edit',
				title: 'Edit',
				hide: props.classInst.organizationId !== id.value,
				action: () => {
					useModals().organizations.editClass.open({
						organizationId: props.classInst.organizationId,
						classInst: props.classInst,
					})
					props.close()
				},
			},
			{
				icon: 'share',
				title: 'Share',
				hide: false,
				action: () => {
					$utils.share(`Join ${props.classInst.title} class on SOFA`, props.classInst.description, props.classInst.shareLink)
					props.close()
				},
			},
			{
				icon: 'trash',
				title: 'Delete',
				hide: props.classInst.organizationId !== id.value,
				action: async () => {
					await deleteClass(props.classInst)
					props.close()
				},
			},
		] as const,
)
</script>
