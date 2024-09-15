<template>
	<form class="flex flex-col gap-4 mdlg:p-6 p-4" @submit.prevent="fundWallet">
		<div class="w-full hidden justify-between items-center mdlg:flex">
			<SofaHeading size="title">Fund wallet</SofaHeading>
			<SofaIcon class="h-[20px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex justify-between items-center sticky top-0 left-0 mdlg:hidden pt-2 pb-4 border-lightGray border-b">
			<SofaHeading>Fund wallet</SofaHeading>
			<SofaIcon class="h-[20px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex flex-col gap-5">
			<SofaInput v-model="factory.amount" type="number" placeholder="Amount">
				<template #prefix>
					<SofaText>₦</SofaText>
				</template>
			</SofaInput>

			<SelectPaymentMethod
				v-model="factory.methodId"
				:showWallet="false"
				:payOnline="fundWalletOnline"
				class="border-t border-lightGray pt-3" />
		</div>

		<div class="w-full md:flex justify-between items-center">
			<SofaButton
				textColor="text-grayColor"
				bgColor="bg-white"
				padding="px-4 py-1"
				class="hidden md:inline w-auto border-2 border-gray-100"
				@click="close">
				Cancel
			</SofaButton>

			<SofaButton
				type="submit"
				textColor="text-white"
				bgColor="bg-primaryBlue"
				padding="px-4 md:py-1 py-3"
				class="w-full md:w-auto border-2 border-transparent md:min-w-[100px]">
				Continue
			</SofaButton>
		</div>
	</form>
</template>

<script lang="ts" setup>
import { useFundWallet } from '@app/composables/payment/wallets'

defineProps<{
	close: () => void
}>()

const { factory, fundWallet, fundWalletOnline } = useFundWallet()
</script>
