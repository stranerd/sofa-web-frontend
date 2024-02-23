import { onMounted, ref, watch } from 'vue'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { AccountUpdateFactory, WalletsUseCases } from '@modules/payment'

const accountsStore = {
	banks: ref<Awaited<ReturnType<(typeof WalletsUseCases)['getBanks']>>>([]),
}

export const useAccountsUpdate = () => {
	const factory = new AccountUpdateFactory()
	const { wallet } = useAuth()

	if (wallet.value) factory.loadEntity(wallet.value.accounts)
	watch(wallet, () => wallet.value && factory.loadEntity(wallet.value.accounts))

	const { asyncFn: fetchBanks, called } = useAsyncFn(
		async () => {
			accountsStore.banks.value = await WalletsUseCases.getBanks()
		},
		{ key: 'payment/wallets/banks' },
	)

	onMounted(async () => {
		if (!called.value) await fetchBanks()
	})

	const {
		asyncFn: updateLocation,
		loading,
		error,
	} = useAsyncFn(async () => {
		await WalletsUseCases.updateAccountNumber(factory)
		return true
	})

	return { ...accountsStore, error, loading, factory, updateLocation }
}
