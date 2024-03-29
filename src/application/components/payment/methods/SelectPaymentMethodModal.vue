<template>
	<form class="flex flex-col p-4 mdlg:p-6 mdlg:gap-5 gap-3" @submit.prevent="submit">
		<div class="w-full hidden justify-between items-center mdlg:flex">
			<SofaHeaderText class="text-xl">Choose payment method</SofaHeaderText>
			<SofaIcon class="h-[20px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex justify-between items-center mdlg:hidden pt-2 pb-4 border-lightGray border-b">
			<SofaNormalText class="!font-bold !text-base">Choose payment method</SofaNormalText>
			<SofaIcon class="h-[20px]" name="circle-close" @click="close" />
		</div>

		<SelectPaymentMethod v-model="selectedMethod" :showWallet="showWallet" :price="price" />

		<SofaButton
			:disabled="!selectedMethod"
			textColor="text-white"
			bgColor="bg-primaryBlue"
			padding="px-4 py-3"
			class="w-full mdlg:w-auto mdlg:ml-auto"
			type="submit">
			Continue
		</SofaButton>
	</form>
</template>

<script lang="ts" setup>
import { Currencies, SelectedPaymentMethod } from '@modules/payment'

const props = withDefaults(
	defineProps<{
		close: () => void
		price?: { amount: number; currency: Currencies }
		onSelect: (method: SelectedPaymentMethod) => void
		autoSelect?: boolean
		showWallet?: boolean
	}>(),
	{ autoSelect: false, showWallet: true, price: undefined },
)

const selectedMethod = defineModel<SelectedPaymentMethod>({ default: null })

const submit = async () => {
	if (!selectedMethod.value) return
	await props.onSelect(selectedMethod.value)
	props.close()
}

if (props.autoSelect) {
	selectedMethod.value = true
	submit().then()
	props.close()
}
</script>
