<template>
	<SofaModal :close="() => close?.()" maxWidth="md:max-w-[30%]">
		<div class="flex flex-col gap-2 relative mdlg:p-6 p-4 py-6 items-center justify-center text-center">
			<SofaHeaderText v-if="title" class="text-xl" :content="title" />

			<SofaNormalText v-if="subTitle" :content="subTitle" />

			<div class="w-full md:flex justify-between items-center grid grid-cols-2 gap-3 mt-3">
				<div v-for="button in buttons" :key="button.label" class="md:w-auto col-span-1 flex flex-col">
					<SofaButton
						v-if="!button.hide"
						:textColor="button.textColor ?? (!button.isClose ? 'text-white' : 'text-grayColor')"
						:bgColor="button.bgColor ?? (!button.isClose ? 'bg-primaryRed' : 'bg-white')"
						padding="px-4 py-2"
						:class="`${button.isClose ? 'border-gray-100 md:!min-w-[100px]' : 'border-transparent'} border-2  md:w-auto w-full`"
						@click="button.action?.()">
						{{ button.label }}
					</SofaButton>
				</div>
			</div>
		</div>
	</SofaModal>
</template>

<script lang="ts" setup>
import SofaButton from '../SofaButton'
import SofaModal from '../SofaModal'
import { SofaHeaderText, SofaNormalText } from '../SofaTypography'

withDefaults(
	defineProps<{
		close: () => void
		title?: string
		subTitle?: string
		buttons: {
			label: string
			hide?: boolean
			bgColor?: string
			textColor?: string
			isClose?: boolean
			action: () => void
		}[]
	}>(),
	{
		title: '',
		subTitle: '',
	},
)
</script>
