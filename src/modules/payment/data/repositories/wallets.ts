import { WalletEntity } from '../../domain/entities/wallets'
import { IWalletRepository } from '../../domain/irepositories/wallets'
import { AccountDetails, BankData, CurrencyCountries, FundDetails, TransferData, WithdrawData } from '../../domain/types'
import { WalletFromModel } from '../models/wallets'
import { HttpClient, Listeners, QueryParams, listenToOne } from '@modules/core'

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

	async updateAccountNumber(accounts: Partial<AccountDetails>[]) {
		const d = await this.client.post<{ accounts: Partial<AccountDetails>[] }, WalletEntity>('/account', { accounts })
		return this.mapper(d)
	}

	async verifyAccountNumber(data: Partial<AccountDetails>) {
		return await this.client.post<Partial<AccountDetails>, string | null>('/account/verify', data)
	}

	async toggleRenewSubscription(data: { renew: boolean }) {
		const d = await this.client.post<{ renew: boolean }, WalletEntity>('/subscriptions/renew/toggle', data)
		return this.mapper(d)
	}

	async subscribeToPlan(data: { planId: string }) {
		const d = await this.client.post<{ planId: string }, WalletEntity>('/subscriptions', data)
		return this.mapper(d)
	}

	async renewPlan() {
		const d = await this.client.post<unknown, WalletEntity>('/subscriptions/renew', {})
		return this.mapper(d)
	}

	async getBanks(country: CurrencyCountries) {
		return await this.client.get<object, BankData[]>(`/account/banks/${country}`, {})
	}

	async fund(data: FundDetails) {
		return this.client.post<FundDetails, boolean>('/fund', data)
	}

	async listen(listeners: Listeners<WalletEntity>) {
		const model = await this.get()
		if (model) await listeners.updated(model)
		return await listenToOne(this.client.socketPath, listeners, this.mapper)
	}
}
