import { useAsyncFn } from '../core/hooks'
import { FundWalletFactory, WithdrawalFactory, WalletsUseCases } from '@modules/payment'

export const useFundWallet = () => {
	const factory = new FundWalletFactory()
	const {
		asyncFn: fundWallet,
		loading,
		error,
	} = useAsyncFn(async () => {
		await WalletsUseCases.fund(factory)
		factory.reset()
	})
	return { fundWallet, loading, error }
}

export const useWithdrawal = () => {
	const factory = new WithdrawalFactory()
	const {
		asyncFn: withdrawFund,
		loading,
		error,
	} = useAsyncFn(async () => {
		await WalletsUseCases.withdraw(factory)
		factory.reset()
	})
	return { withdrawFund, loading, error }
}
