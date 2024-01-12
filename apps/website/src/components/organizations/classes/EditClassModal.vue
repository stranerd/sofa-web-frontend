<template>
	<SofaModal :close="() => emit('close')">
		<div class="p-4 bg-white flex flex-col gap-8">
			<div class="flex w-full items-center gap-2 justify-between mdlg:justify-center">
				<SofaHeaderText class="!font-bold !text-deepGray" content="Edit class" />
				<SofaIcon class="!block mdlg:!hidden h-[16px]" name="circle-close" @click="emit('close')" />
			</div>
			<ClassForm
				:factory="factory"
				:cancel="() => emit('close')"
				:submit="() => updateClass().then((res) => (res ? emit('close') : null))" />
		</div>
	</SofaModal>
</template>

<script lang="ts" setup>
import { useUpdateClass } from '@/composables/organizations/classes'
import { SofaHeaderText, SofaIcon, SofaModal2 as SofaModal } from 'sofa-ui-components'
import { defineEmits, defineProps } from 'vue'
import ClassForm from './ClassForm.vue'

const props = defineProps({
	organizationId: {
		type: String,
		required: true,
	},
})

const { updateClass, factory } = useUpdateClass(props.organizationId)

const emit = defineEmits(['close'])
</script>
