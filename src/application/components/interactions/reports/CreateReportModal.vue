<template>
	<form class="flex flex-col gap-4 mdlg:p-6 p-4" @submit.prevent="submit">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeaderText class="!text-xl" :content="modTitle" />
		</div>

		<div class="w-full flex justify-between items-center md:hidden">
			<SofaNormalText class="!font-bold" :content="modTitle" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<SofaTextarea
			v-model="factory.message"
			padding="p-4"
			placeholder="Why are you reporting this?"
			textAreaStyle="!bg-lightGray rounded-custom"
			:error="factory.errors.message" />

		<SofaButton :disabled="!factory.valid" type="submit" padding="px-5 py-3" class="self-center w-full mdlg:w-auto">
			Submit
		</SofaButton>
	</form>
</template>

<script lang="ts" setup>
import { useCreateReport } from '@app/composables/interactions/reports'
import { Interaction, singulars } from '@modules/interactions'
import { computed } from 'vue'

const props = defineProps<
	Interaction & {
		close: () => void
		afterSubmit?: () => void
		title?: string
	}
>()

const modTitle = computed(() => props.title ?? `Report this ${singulars[props.type] ?? props.type}`)

const { factory, createReport } = useCreateReport(props)

const submit = async () => {
	const succeeded = await createReport()
	if (!succeeded) return
	props.close()
	props.afterSubmit?.()
}
</script>
