<template>
	<SofaModal :close="() => close?.()" maxWidth="md:max-w-[30%]">
		<div class="flex flex-col gap-2 relative mdlg:p-6 p-4 py-6 items-center justify-center text-center">
			<SofaHeading v-if="title" size="title" :content="title" />
			<SofaText v-if="sub" :content="sub" />

			<SofaTextarea v-model="message" :rows="3" :placeholder="placeholder" />

			<div class="w-full md:flex justify-between items-center grid grid-cols-2 gap-3 mt-3">
				<div v-for="button in [left, right]" :key="button.label" class="md:w-auto col-span-1 flex flex-col">
					<SofaButton
						v-if="!button.hide"
						:textColor="button.textColor ?? (!button.isClose ? 'text-white' : 'text-grayColor')"
						:bgColor="button.bgColor ?? (!button.isClose ? 'bg-primaryRed' : 'bg-white')"
						:disabled="required && !message && button === right"
						padding="px-4 py-2"
						:class="`${button.isClose ? 'border-gray-100 md:!min-w-[100px]' : 'border-transparent'} border-2  md:w-auto w-full`"
						@click="button.action(message)">
						{{ button.label }}
					</SofaButton>
				</div>
			</div>
		</div>
	</SofaModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

type ButtonConfig = {
	label: string
	hide?: boolean
	bgColor?: string
	textColor?: string
	isClose?: boolean
	action: (message: string | undefined) => void
}

withDefaults(
	defineProps<{
		close: () => void
		title?: string
		sub?: string
		left: ButtonConfig
		right: ButtonConfig
		placeholder?: string
		required?: boolean
	}>(),
	{
		title: '',
		sub: '',
		placeholder: 'Enter message',
		required: true,
	},
)

const message = ref('')
</script>
