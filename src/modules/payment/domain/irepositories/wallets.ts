import { WalletEntity } from '../entities/wallets'
import { AccountDetails, BankData, FundDetails, TransferData, WithdrawData } from '../types'
import { Listeners } from '@modules/core'

export interface IWalletRepository {
	get: () => Promise<WalletEntity>
	toggleRenewSubscription: (data: { renew: boolean }) => Promise<WalletEntity>
	updateAccountNumber: (account: AccountDetails) => Promise<WalletEntity>
	transfer: (data: TransferData) => Promise<boolean>
	withdraw: (data: WithdrawData) => Promise<boolean>
	getBanks: () => Promise<BankData>
	verifyAccountNumber: (account: AccountDetails) => Promise<string | null>
	fundWallet: (data: FundDetails) => Promise<boolean>
	listenToOne: (listeners: Listeners<WalletEntity>) => Promise<() => void>
}
