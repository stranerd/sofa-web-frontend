<template>
	<div class="w-full bg-white shadow-custom rounded-custom p-4 mdlg:p-6 flex flex-col gap-4">
		<SofaHeaderText>Payment Method</SofaHeaderText>
		<div class="flex flex-col gap-8">
			<div class="flex flex-col gap-4">
				<a v-if="showWallet" class="w-full flex items-center gap-3 p-3 bg-lightGray rounded-custom">
					<SofaIcon customClass="h-[25px]" name="wallet" />
					<SofaNormalText>Wallet ({{ balance }})</SofaNormalText>
				</a>
				<a v-for="method in methods" :key="method.hash" class="w-full flex items-center gap-3 p-3 bg-lightGray rounded-custom">
					<SofaIcon customClass="h-[20px]" name="card" />
					<SofaNormalText> **** **** **** {{ method.data.last4Digits }} </SofaNormalText>
					<SofaRadio v-model="selectedMethod" :value="method.id" name="payment-method" class="ml-auto" />
				</a>
			</div>
			<div class="flex flex-col gap-4">
				<a
					v-if="showWallet"
					class="col-span-1 flex items-center p-3 gap-2 rounded-custom border-2 border-darkLightGray"
					@click="showFundWallet">
					<SofaIcon class="h-[16px]" name="fund-wallet" />
					<SofaNormalText class="text-grayColor">Fund wallet</SofaNormalText>
				</a>
				<a class="w-full flex items-center gap-3 p-3 border-2 rounded-custom border-darkLightGray" @click="addMethod">
					<SofaIcon customClass="h-[18px]" name="add-gray" />
					<SofaNormalText color="text-grayColor">Add credit or debit card</SofaNormalText>
				</a>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useModals } from '@app/composables/core/modals'
import { useMyMethods } from '@app/composables/payment/methods'
import { useAuth } from '@app/composables/auth/auth'
import { Logic } from 'sofa-logic'

withDefaults(defineProps<{ showWallet: boolean }>(), { showWallet: true })

const selectedMethod = defineModel<string | null>({ default: null })

const { wallet } = useAuth()

const { addMethod, methods } = useMyMethods()

const showFundWallet = () => {
	useModals().payment.fundWallet.open({})
}

const balance = computed(() => (wallet.value ? Logic.Common.formatPrice(wallet.value.balance.amount, wallet.value.balance.currency) : ''))
</script>
