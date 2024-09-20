<template>
	<form class="flex flex-col gap-4 mdlg:p-6 p-4" @submit.prevent="submit">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeading size="title" :content="modTitle" />
		</div>

		<div class="w-full flex justify-between items-center md:hidden">
			<SofaHeading :content="modTitle" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<SofaTextarea v-model="factory.message" placeholder="Why are you reporting this?" class="p-4" :error="factory.errors.message" />

		<SofaButton :disabled="!factory.valid" type="submit" padding="px-5 py-3" class="self-center w-full mdlg:w-auto">
			Submit
		</SofaButton>
	</form>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useCreateReport } from '@app/composables/interactions/reports'
import { Interaction, singulars } from '@modules/interactions'

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
