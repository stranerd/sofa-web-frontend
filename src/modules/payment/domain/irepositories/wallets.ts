import { WalletEntity } from '../entities/wallets'
import { AccountDetails, TransferData, WithdrawData } from '../types'

export interface IWalletRepository {
	get: () => Promise<WalletEntity>
	toggleRenewSubscription: (data: { renew: boolean }) => Promise<WalletEntity>
	updateAccountNumber: (account: AccountDetails) => Promise<WalletEntity>
	transfer: (data: TransferData) => Promise<boolean>
	withdraw: (data: WithdrawData) => Promise<boolean>
}
