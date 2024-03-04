import { WalletEntity } from '../entities/wallets'
import { AccountDetails, BankData, CurrencyCountries, FundDetails, TransferData, WithdrawData } from '../types'
import { Listeners } from '@modules/core'

export interface IWalletRepository {
	get: () => Promise<WalletEntity>
	toggleRenewSubscription: (data: { renew: boolean }) => Promise<WalletEntity>
	updateAccountNumber: (accounts: Partial<AccountDetails>[]) => Promise<WalletEntity>
	transfer: (data: TransferData) => Promise<boolean>
	withdraw: (data: WithdrawData) => Promise<boolean>
	getBanks: (country: CurrencyCountries) => Promise<BankData[]>
	verifyAccountNumber: (account: Partial<AccountDetails>) => Promise<string | null>
	fund: (data: FundDetails) => Promise<boolean>
	listen: (listeners: Listeners<WalletEntity>) => Promise<() => void>
	subscribeToPlan: (data: { planId: string; methodId?: string | null }) => Promise<WalletEntity>
}
