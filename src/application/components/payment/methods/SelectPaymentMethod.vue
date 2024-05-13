<template>
	<div class="flex flex-col gap-4">
		<a v-if="payOnline" class="w-full flex items-center gap-3 p-3 bg-lightGray rounded-custom" @click="payOnline">
			<SofaIcon customClass="h-[20px] fill-deepGray" name="socials-website" />
			<SofaNormalText> Pay online </SofaNormalText>
		</a>
		<a
			v-if="showWallet && wallet"
			class="w-full flex items-center gap-3 p-3 bg-lightGray rounded-custom"
			:class="{ 'border-primaryBlue border-2': selectedMethod === true }"
			@click="selectedMethod = true">
			<SofaIcon customClass="h-[25px]" name="wallet" />
			<SofaNormalText> Wallet ({{ balance }}) {{ wallet.balance.amount < amount ? '- Insufficient funds' : '' }} </SofaNormalText>
		</a>
		<a
			v-for="method in methods"
			:key="method.hash"
			class="w-full flex items-center gap-3 p-3 bg-lightGray rounded-custom"
			:class="{ 'border-primaryBlue border-2': selectedMethod === method.id }"
			@click="selectedMethod = method.id">
			<SofaIcon customClass="h-[20px]" name="atm-card" />
			<SofaNormalText> **** **** **** {{ method.data.last4Digits }} </SofaNormalText>
		</a>
		<a class="w-full flex items-center gap-3 p-3 border-2 border-darkLightGray text-grayColor rounded-custom" @click="addMethod">
			<SofaIcon class="h-[18px]" name="add" />
			<SofaText>Add credit or debit card</SofaText>
		</a>
		<a
			v-if="showWallet"
			class="col-span-1 flex items-center p-3 gap-2 rounded-custom border-2 border-darkLightGray"
			@click="showFundWallet">
			<SofaIcon class="h-[16px]" name="fund-wallet" />
			<SofaNormalText class="text-grayColor">Fund wallet</SofaNormalText>
		</a>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useModals } from '@app/composables/core/modals'
import { useMyMethods } from '@app/composables/payment/methods'
import { useAuth } from '@app/composables/auth/auth'
import { Currencies, SelectedPaymentMethod } from '@modules/payment'

const props = withDefaults(
	defineProps<{
		showWallet?: boolean
		payOnline?: () => void
		price?: { amount: number; currency: Currencies }
	}>(),
	{ showWallet: true, payOnline: undefined, price: undefined },
)

const amount = props.price?.amount ?? 0

const selectedMethod = defineModel<SelectedPaymentMethod>({ default: null })

const { wallet } = useAuth()

const { addMethod, methods } = useMyMethods()

const showFundWallet = () => {
	useModals().payment.fundWallet.open({})
}

const balance = computed(() => (wallet.value ? $utils.formatPrice(wallet.value.balance.amount, wallet.value.balance.currency) : ''))
</script>
