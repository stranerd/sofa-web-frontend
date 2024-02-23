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

	const activeAccountFactory = ref(null as (typeof factory.factories)[number] | null)
	const accountName = ref(null as string | null)

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

	const addAccount = () => {
		activeAccountFactory.value = factory.add()
	}

	const {
		asyncFn: updateAccounts,
		loading,
		error,
	} = useAsyncFn(async () => {
		await WalletsUseCases.updateAccountNumber(factory)
		activeAccountFactory.value = null
		return true
	})

	const { asyncFn: verifyAccountNumber } = useAsyncFn(
		async () => await WalletsUseCases.verifyAccountNumber(await activeAccountFactory.value!.toModel()),
		{ pre: () => !!activeAccountFactory.value && activeAccountFactory.value.valid },
	)

	watch(activeAccountFactory, () => {
		accountName.value = null
	})

	return {
		...accountsStore,
		error,
		loading,
		accountName,
		activeAccountFactory,
		addAccount,
		updateAccounts,
		verifyAccountNumber,
	}
}
