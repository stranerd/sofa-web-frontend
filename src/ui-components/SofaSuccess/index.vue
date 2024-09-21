<template>
	<SofaModal :close="() => close?.()" maxWidth="md:max-w-[30%]">
		<div class="flex flex-col gap-2 relative mdlg:p-6 p-4 py-6 items-center justify-center text-center">
			<SofaIcon name="success-modal-icon" class="h-[39px]" />

			<SofaHeading v-if="title" size="title" :content="title" />

			<SofaText v-if="sub" :content="sub" />

			<SofaButton
				v-if="!button.hide"
				:color="button.color ?? 'blue'"
				padding="px-4 py-2"
				class="md:w-auto w-full"
				@click="button.action()">
				{{ button.label }}
			</SofaButton>
		</div>
	</SofaModal>
</template>

<script lang="ts" setup>
import SofaButton from '../SofaButton'

withDefaults(
	defineProps<{
		close: () => void
		title?: string
		sub?: string
		button: {
			label: string
			hide?: boolean
			color?: InstanceType<typeof SofaButton>['$props']['color']
			action: () => void
		}
	}>(),
	{
		title: '',
		sub: '',
	},
)
</script>
