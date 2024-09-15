<template>
	<form v-if="wallet" class="flex flex-col gap-4 mdlg:p-6 p-4" @submit.prevent="formOptions.handler">
		<div class="w-full hidden justify-between items-center mdlg:flex">
			<SofaHeading size="title">Withdraw money</SofaHeading>
			<SofaIcon class="h-[20px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex justify-between items-center sticky top-0 left-0 mdlg:hidden pt-2 pb-4 border-lightGray border-b">
			<SofaHeading>Withdraw money</SofaHeading>
			<SofaIcon class="h-[20px]" name="circle-close" @click="close" />
		</div>

		<div v-if="showAddNewAccount && activeAccountFactory" class="w-full flex flex-col gap-3">
			<SofaInput v-model="activeAccountFactory.bankNumber" type="text" placeholder="Account number"> </SofaInput>

			<SofaSelect
				v-model="activeAccountFactory.bankCode"
				placeholder="Bank"
				:options="banks.map((bank) => ({ key: bank.code, value: bank.name }))">
			</SofaSelect>

			<SofaText v-if="accountName" :content="accountName" class="text-primaryGreen" />
		</div>

		<div v-else class="w-full flex flex-col gap-3">
			<SofaInput v-model="withdrawalFactory.amount" type="number" placeholder="Amount">
				<template #prefix>
					<SofaText>
						{{ $utils.getCurrency(wallet.balance.currency) }}
					</SofaText>
				</template>
			</SofaInput>

			<label
				v-for="(account, index) in wallet.accounts"
				:key="index"
				:for="`account-${index}`"
				:class="{ 'border border-primaryPurple': index === selectedAccountIndex }"
				class="w-full flex items-center gap-3 p-4 rounded-custom bg-lightGray text-grayColor">
				<SofaIcon class="h-[18px]" name="bank" />
				<SofaText class="capitalize flex-1 truncate">
					{{ account.bankName }}({{ account.bankNumber.slice(account.bankNumber.length - 4) }})
				</SofaText>
				<SofaRadio :id="`account-${index}`" v-model="selectedAccountIndex" :value="index" name="account" />
			</label>

			<a class="w-full flex items-center gap-3 p-4 rounded-custom border-2 border-lightGray text-grayColor" @click="addAccount">
				<SofaIcon class="h-[18px] fill-current" name="add" />
				<SofaText content="Add new account" />
			</a>
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
				:disabled="!formOptions.isValid"
				type="submit"
				textColor="text-white"
				bgColor="bg-primaryBlue"
				padding="px-4 md:py-1 py-3"
				class="w-full md:w-auto border-2 border-transparent md:min-w-[100px]">
				{{ formOptions.btnLabel }}
			</SofaButton>
		</div>
	</form>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useAccountsUpdate } from '@app/composables/payment/accounts'
import { useWithdrawal } from '@app/composables/payment/wallets'

defineProps<{
	close: () => void
}>()

const { wallet } = useAuth()
const { banks, showAddNewAccount, addAccount, activeAccountFactory, updateAccounts, verifyAccountNumber, accountName } = useAccountsUpdate()
const { factory: withdrawalFactory, withdraw } = useWithdrawal()
const selectedAccountIndex = ref(Number.MAX_SAFE_INTEGER)

watch(selectedAccountIndex, () => {
	if (wallet.value?.accounts[selectedAccountIndex.value]) withdrawalFactory.account = wallet.value.accounts[selectedAccountIndex.value]
})

const formOptions = computed(() => {
	if (!showAddNewAccount.value)
		return {
			btnLabel: 'Continue',
			handler: withdraw,
			isValid: withdrawalFactory.valid,
		}
	if (accountName.value)
		return {
			btnLabel: 'Save account',
			handler: updateAccounts,
			isValid: activeAccountFactory.value?.valid,
		}
	return {
		btnLabel: 'Verify',
		handler: verifyAccountNumber,
		isValid: activeAccountFactory.value?.valid,
	}
})
</script>
