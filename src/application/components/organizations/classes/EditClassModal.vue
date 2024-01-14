<template>
	<div class="p-4 flex flex-col gap-8">
		<div class="flex w-full items-center gap-2 justify-between mdlg:justify-center">
			<SofaHeaderText class="!font-bold !text-deepGray" content="Edit class" />
			<SofaIcon class="!block mdlg:!hidden h-[16px]" name="circle-close" @click="close" />
		</div>
		<ClassForm :factory="factory" :cancel="close" :submit="updateClass" />
	</div>
</template>

<script lang="ts" setup>
import { useUpdateClass } from '@app/composables/organizations/classes'
import { ClassEntity } from '@modules/organizations'
import ClassForm from './ClassForm.vue'

const props = defineProps<{
	organizationId: string
	classInst: ClassEntity
	close: () => void
}>()

const { updateClass, factory } = useUpdateClass(props.organizationId, props.classInst)
</script>
