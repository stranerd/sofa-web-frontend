<template>
	<form class="flex flex-col gap-4 mdlg:p-6 p-4" @submit.prevent="fundWallet">
		<div class="w-full hidden justify-between items-center mdlg:flex">
			<SofaHeaderText customClass="text-xl">Fund wallet</SofaHeaderText>
			<SofaIcon customClass="h-[20px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex justify-between items-center sticky top-0 left-0 mdlg:hidden pt-2 pb-4 border-lightGray border-b">
			<SofaNormalText customClass="!font-bold !text-base">Fund wallet</SofaNormalText>
			<SofaIcon customClass="h-[20px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex flex-col gap-5">
			<SofaTextField
				v-model="factory.amount"
				customClass="rounded-custom !bg-lightGray"
				type="number"
				placeholder="Amount"
				borderColor="border-transparent">
				<template #inner-prefix>
					<SofaNormalText>₦</SofaNormalText>
				</template>
			</SofaTextField>

			<div class="w-full flex flex-col gap-2 border-t border-lightGray pt-3">
				<a class="w-full flex items-center gap-3 p-3 bg-lightGray rounded-custom" @click="fundWalletOnline">
					<SofaIcon customClass="h-[20px] fill-deepGray" name="socials-website" />
					<SofaNormalText> Pay online </SofaNormalText>
				</a>

				<a
					v-for="method in methods"
					:key="method.hash"
					class="w-full flex items-center gap-3 p-3 bg-lightGray rounded-custom"
					:class="{ 'border-primaryBlue border-2': factory.methodId === method.id }"
					@click="factory.methodId = factory.methodId ? '' : method.id">
					<SofaIcon customClass="h-[20px]" name="card" />
					<SofaNormalText> **** **** **** {{ method.data.last4Digits }} </SofaNormalText>
				</a>

				<a class="w-full flex items-center gap-3 p-3 border-2 rounded-custom border-darkLightGray" @click="addMethod">
					<SofaIcon customClass="h-[18px]" name="add-gray" />
					<SofaNormalText color="text-grayColor">Add credit or debit card</SofaNormalText>
				</a>
			</div>
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
import { useMyMethods } from '@app/composables/payment/methods'
import { useFundWallet } from '@app/composables/payment/wallets'

defineProps<{
	close: () => void
}>()

const { factory, fundWallet, fundWalletOnline } = useFundWallet()
const { methods, addMethod } = useMyMethods()
</script>
