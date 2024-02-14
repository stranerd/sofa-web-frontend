<template>
	<div v-if="wallet" class="flex flex-col gap-4 mdlg:p-6 p-4">
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
				ref="amount"
				v-model="withdrawForm.amount"
				customClass="rounded-custom !bg-lightGray"
				type="text"
				name="Amount"
				placeholder="Amount"
				borderColor="border-transparent"
				:rules="[Logic.Form.RequiredRule]"
				:isFormatted="true">
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
				:options="AllCommercialBanks.map((bank) => ({ key: bank.code, value: bank.name }))">
			</SofaSelect>
		</div>

		<div class="w-full md:flex justify-between items-center grid grid-cols-2 md:gap-0 gap-3 mdlg:py-0 py-4">
			<SofaButton
				textColor="text-grayColor"
				bgColor="bg-white"
				padding="px-4 py-1"
				class="hidden md:inline w-auto border-2 border-gray-100"
				@click="close">
				Cancel
			</SofaButton>

			<div class="md:!w-auto col-span-2 flex flex-col">
				<SofaButton
					textColor="text-white"
					bgColor="bg-primaryBlue"
					padding="px-4 md:!py-1 py-3"
					customClass="border-2 border-transparent md:!min-w-[100px] md:!w-auto w-full"
					@click="submit">
					Continue
				</SofaButton>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { capitalize, onMounted, reactive, ref, watch } from 'vue'
import { Logic, SelectOption } from 'sofa-logic'
import { useAuth } from '@app/composables/auth/auth'

// TODO: cleanup with factory and hook for withdrawals

const props = defineProps<{
	close: () => void
}>()

const { wallet } = useAuth()

const AllCommercialBanks = ref(Logic.Payment.AllCommercialBanks!)
const commercialBankOptions = ref<SelectOption[]>([])

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

const setCommercialBankOptions = () => {
	commercialBankOptions.value.length = 0
	AllCommercialBanks.value?.forEach((bank) => {
		commercialBankOptions.value.push({
			key: bank.code,
			value: bank.name,
		})
	})
}

onMounted(() => {
	if (!AllCommercialBanks.value) {
		Logic.Payment.GetCommercialBanks().then(() => {
			AllCommercialBanks.value = Logic.Payment.AllCommercialBanks!
			setCommercialBankOptions()
		})
	}
})

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
</script>
