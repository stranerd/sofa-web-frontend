<template>
	<div class="p-4 flex flex-col gap-8">
		<div class="flex w-full items-center gap-2 justify-between mdlg:justify-center">
			<SofaHeaderText class="!font-bold !text-deepGray" content="Create a class" />
			<SofaIcon class="!block mdlg:!hidden h-[16px]" name="circle-close" @click="close" />
		</div>
		<ClassForm :factory="factory" :cancel="close" :submit="createClass" />
	</div>
</template>

<script lang="ts" setup>
import { useCreateClass } from '@app/composables/organizations/classes'
import ClassForm from './ClassForm.vue'

const props = defineProps<{
	organizationId: string
	close: () => void
}>()

const { createClass, factory } = useCreateClass(props.organizationId)
</script>
