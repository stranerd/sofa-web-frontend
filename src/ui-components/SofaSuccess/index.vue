<template>
	<SofaModal :close="() => close?.()" maxWidth="md:max-w-[30%]">
		<div class="flex flex-col gap-2 relative mdlg:p-6 p-4 py-6 items-center justify-center text-center">
			<SofaIcon name="success-modal-icon" class="h-[39px]" />

			<SofaHeaderText v-if="title" class="text-xl" :content="title" />

			<SofaNormalText v-if="sub" :content="sub" />

			<SofaButton
				v-if="!button.hide"
				:textColor="button.textColor ?? 'text-white'"
				:bgColor="button.bgColor ?? 'bg-primaryBlue'"
				padding="px-4 py-2"
				class="border-transparent border-2 md:w-auto w-full"
				@click="button.action()">
				{{ button.label }}
			</SofaButton>
		</div>
	</SofaModal>
</template>

<script lang="ts" setup>
import SofaButton from '../SofaButton'
import SofaIcon from '../SofaIcon'
import SofaModal from '../SofaModal'
import { SofaHeaderText, SofaNormalText } from '../SofaTypography'

withDefaults(
	defineProps<{
		close: () => void
		title?: string
		sub?: string
		button: {
			label: string
			hide?: boolean
			bgColor?: string
			textColor?: string
			action: () => void
		}
	}>(),
	{
		title: '',
		sub: '',
	},
)
</script>
