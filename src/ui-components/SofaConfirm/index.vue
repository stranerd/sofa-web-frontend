<template>
	<SofaModal :close="() => close?.()" maxWidth="md:max-w-[30%]">
		<div class="flex flex-col gap-2 relative mdlg:p-6 p-4 py-6 items-center justify-center text-center">
			<SofaHeading v-if="title" size="title" :content="title" />
			<SofaText v-if="sub" :content="sub" />

			<div class="w-full md:flex justify-between items-center grid grid-cols-2 gap-3 mt-3">
				<div v-for="button in [left, right]" :key="button.label" class="md:w-auto col-span-1 flex flex-col">
					<SofaButton
						v-if="!button.hide"
						:color="button.color ?? (!button.isClose ? 'red' : 'white')"
						padding="px-4 py-2"
						:class="['border-2  md:w-auto w-full', button.isClose ? 'border-gray-100 md:!min-w-[100px]' : 'border-transparent']"
						@click="button.action()">
						{{ button.label }}
					</SofaButton>
				</div>
			</div>
		</div>
	</SofaModal>
</template>

<script lang="ts" setup>
import SofaButton from '../SofaButton'

type ButtonConfig = {
	label: string
	hide?: boolean
	color?: InstanceType<typeof SofaButton>['$props']['color']
	isClose?: boolean
	action: () => void
}

withDefaults(
	defineProps<{
		close: () => void
		title?: string
		sub?: string
		left: ButtonConfig
		right: ButtonConfig
	}>(),
	{
		title: '',
		sub: '',
	},
)
</script>
