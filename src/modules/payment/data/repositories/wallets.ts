import { WalletFromModel } from '../models/wallets'
import { HttpClient, Listeners, QueryParams, listenToOne } from '@modules/core'
import { IWalletRepository } from '@modules/payment/domain/irepositories/wallets'
import { WalletEntity } from '@modules/payment/domain/entities/wallets'
import { AccountDetails, BankData, FundDetails, TransferData, WithdrawData } from '@modules/payment/domain/types'

export class WalletRepository implements IWalletRepository {
	private static instance: WalletRepository
	private client: HttpClient
	private mapper = (model: WalletFromModel | null) => (model ? new WalletEntity(model) : null) as WalletEntity

	private constructor() {
		this.client = new HttpClient('/payment/wallets')
	}

	static getInstance() {
		if (!WalletRepository.instance) WalletRepository.instance = new WalletRepository()
		return WalletRepository.instance
	}

	async get() {
		const d = await this.client.get<QueryParams, WalletFromModel>('/', {})
		return this.mapper(d)
	}

	async transfer(data: Partial<TransferData>) {
		return await this.client.post<unknown, boolean>('/transfer', data)
	}

	async withdraw(data: Partial<WithdrawData>) {
		return await this.client.post<unknown, boolean>('/withdraw', data)
	}

	async updateAccountNumber(data: Partial<AccountDetails>) {
		const d = await this.client.post<Partial<AccountDetails>, WalletEntity>('/account', data)
		return this.mapper(d)
	}

	async verifyAccountNumber(data: Partial<AccountDetails>) {
		return await this.client.post<Partial<AccountDetails>, string | null>('/account/verify', data)
	}

	async toggleRenewSubscription(data: { renew: boolean }) {
		const d = await this.client.post<{ renew: boolean }, WalletEntity>('/subscriptions/renewal/toggle', data)
		return this.mapper(d)
	}

	async getBanks() {
		return await this.client.get<QueryParams, BankData>('/account/banks/NG', {})
	}

	async fundWallet(data: FundDetails) {
		return this.client.post<FundDetails, boolean>('/fund', data)
	}

	async listenToOne(listeners: Listeners<WalletEntity>) {
		const model = await this.get()
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/`, listeners, this.mapper)
	}
}
