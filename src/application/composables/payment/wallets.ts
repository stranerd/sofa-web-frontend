import { useAsyncFn } from '../core/hooks'
import { useModals } from '../core/modals'
import { createTransaction } from './transactions'
import { FundWalletFactory, TransactionType, WalletsUseCases, WithdrawalFactory } from '@modules/payment'

export const useFundWallet = () => {
	const factory = new FundWalletFactory()
	const {
		asyncFn: fundWallet,
		loading,
		error,
	} = useAsyncFn(async () => {
		await WalletsUseCases.fund(factory)
		factory.reset()
		useModals().payment.fundWallet.close()
	})
	const { asyncFn: fundWalletOnline } = useAsyncFn(
		async () => {
			await createTransaction(factory.amount, TransactionType.fundWallet, '')
			factory.reset()
			useModals().payment.fundWallet.close()
		},
		{ pre: () => factory.isValid('amount') },
	)
	return { fundWallet, fundWalletOnline, factory, loading, error }
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
