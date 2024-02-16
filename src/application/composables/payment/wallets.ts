import { useAsyncFn } from '../core/hooks'
import { FundWalletFactory } from '@modules/payment/domain/factories/wallet/fund'
import { WalletsUseCases } from '@modules/payment'
import { WithdrawalFactory } from '@modules/payment/domain/factories/wallet/withdrawal'

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
		const data = await factory.toModel()
		await WalletsUseCases.withdraw(data)
		factory.reset()
	})
	return { withdrawFund, loading, error }
}
