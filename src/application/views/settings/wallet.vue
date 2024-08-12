<template>
	<SettingsLayout title="Wallet">
		<div class="w-full flex flex-col gap-5 mdlg:px-0 px-4">
			<div class="flex flex-col gap-4 bg-white rounded-2xl md:p-5 p-4 shadow-custom">
				<SofaHeaderText size="xl">Wallet</SofaHeaderText>

				<div class="w-full flex flex-col gap-1">
					<div class="flex items-center gap-2">
						<SofaNormalText>Balance</SofaNormalText>
						<SofaIcon
							:class="showMoney ? 'h-[10px]' : 'h-[15px]'"
							:name="showMoney ? 'hide' : 'show'"
							@click="showMoney = !showMoney" />
					</div>

					<SofaHeaderText class="mdlg:!text-3xl !text-2xl">
						{{ showMoney ? balance : '****' }}
					</SofaHeaderText>

					<div class="mt-3 grid grid-cols-2 gap-3 pt-4">
						<a
							class="col-span-1 flex items-center p-3 gap-2 rounded-custom justify-center border-2 border-darkLightGray"
							@click="showFundWallet">
							<SofaIcon class="h-[16px]" name="fund-wallet" />
							<SofaNormalText class="text-grayColor">Fund wallet</SofaNormalText>
						</a>

						<a
							class="col-span-1 flex items-center p-3 gap-2 rounded-custom justify-center border-2 border-darkLightGray"
							@click="showWalletWithdraw">
							<SofaIcon class="h-[16px]" name="withdraw-wallet" />
							<SofaNormalText class="text-grayColor">Withdraw</SofaNormalText>
						</a>
					</div>
				</div>
			</div>

			<MethodsList class="bg-white rounded-2xl md:p-5 p-4 shadow-custom pb-6" />

			<TransactionsList class="bg-white rounded-2xl md:p-5 p-4 shadow-custom" />
		</div>
	</SettingsLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { computed, defineComponent, ref } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'

export default defineComponent({
	name: 'SettingsWalletPage',
	routeConfig: { goBackRoute: '/settings', middlewares: ['isAuthenticated'] },
	setup() {
		useHead({
			title: 'Wallet',
		})

		const { wallet } = useAuth()

		const showMoney = ref(true)

		const showFundWallet = () => {
			useModals().payment.fundWallet.open({})
		}

		const showWalletWithdraw = () => {
			useModals().payment.withdraw.open({})
		}

		const balance = computed(() => (wallet.value ? $utils.formatPrice(wallet.value.balance.amount, wallet.value.balance.currency) : ''))

		return { balance, showMoney, showFundWallet, showWalletWithdraw }
	},
})
</script>
