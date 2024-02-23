<template>
	<form v-if="wallet" class="flex flex-col gap-4 mdlg:p-6 p-4" @submit.prevent="withdraw">
		<div class="w-full hidden justify-between items-center mdlg:flex">
			<SofaHeaderText customClass="text-xl">Withdraw money</SofaHeaderText>
			<SofaIcon customClass="h-[20px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex justify-between items-center sticky top-0 left-0 mdlg:hidden py-2 border-lightGray border-b">
			<SofaNormalText customClass="!font-bold !text-base">Withdraw money</SofaNormalText>
			<SofaIcon customClass="h-[20px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex flex-col gap-3 mdlg:!px-0 px-4">
			<SofaTextField
				v-model="factory.amount"
				customClass="rounded-custom !bg-lightGray"
				type="number"
				placeholder="Amount"
				borderColor="border-transparent">
				<template #inner-prefix>
					<SofaNormalText>
						{{ Logic.Common.getCurrency(wallet.balance.currency) }}
					</SofaNormalText>
				</template>
			</SofaTextField>

			<SofaTextField
				ref="account_number"
				v-model="withdrawForm.account_number"
				customClass="rounded-custom !bg-lightGray"
				type="number"
				name="Account number"
				placeholder="Account number"
				borderColor="border-transparent"
				:rules="[Logic.Form.RequiredRule]">
			</SofaTextField>

			<SofaSelect
				ref="bank"
				v-model="withdrawForm.bank"
				customClass="rounded-custom !bg-lightGray"
				name="Bank"
				placeholder="Bank"
				borderColor="border-transparent"
				:rules="[Logic.Form.RequiredRule]"
				:options="banks.map((bank) => ({ key: bank.code, value: bank.name }))">
			</SofaSelect>
		</div>

		<div class="w-full md:flex justify-between items-center grid grid-cols-2 mdlg:py-0 py-4">
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
import { capitalize, reactive, watch } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useAccountsUpdate } from '@app/composables/payment/accounts'
import { useWithdrawal } from '@app/composables/payment/wallets'
import { Logic } from 'sofa-logic'

const props = defineProps<{
	close: () => void
}>()

const { wallet } = useAuth()
const { banks } = useAccountsUpdate()
const { factory, withdraw } = useWithdrawal()

const withdrawForm = reactive({
	amount: '',
	account_number: '',
	bank: '',
})

const submit = async () => {
	if (withdrawForm.account_number && withdrawForm.amount && withdrawForm.bank) {
		const amount = parseFloat(withdrawForm.amount.replace(/,/g, ''))

		if (amount < 1000) {
			Logic.Common.showAlert({
				message: `Withdrawal amount cannot be less than ${Logic.Common.formatPrice(1000)}`,
				type: 'warning',
			})
			return
		}

		Logic.Payment.WithdrawalFromWalletForm = {
			amount,
			account: {
				bankCode: withdrawForm.bank,
				bankNumber: withdrawForm.account_number,
				country: 'NG',
			},
		}

		Logic.Payment.WithdrawFromWallet()
			?.then((data) => {
				if (data) {
					Logic.Common.showAlert({
						message: 'Withdrawal successful',
						type: 'success',
					})
				} else {
					Logic.Common.showAlert({
						message: 'Withdrawal failed',
						type: 'error',
					})
				}

				props.close()
			})
			.catch((error) => {
				Logic.Common.showAlert({
					message: capitalize(error.response.data[0]?.message),
					type: 'error',
				})
			})
	}
}

watch(withdrawForm, () => {
	Logic.Common.debounce(() => {
		if (withdrawForm.account_number.length >= 10 && withdrawForm.bank) {
			Logic.Payment.verifyAccountNumberForm = {
				bankCode: withdrawForm.bank,
				bankNumber: withdrawForm.account_number,
				country: 'NG',
			}

			Logic.Payment.VerifyAccountNumber()
				?.then(() => {
					// console.log(data);
				})
				.catch(() => {
					//
				})
		}
	})
})
submit
</script>
