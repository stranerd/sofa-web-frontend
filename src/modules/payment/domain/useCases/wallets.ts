import { WalletEntity } from '../entities/wallets'
import { AccountUpdateFactory } from '../factories/accounts'
import { FundWalletFactory } from '../factories/fundWallet'
import { WithdrawalFactory } from '../factories/withdrawal'
import { IWalletRepository } from '../irepositories/wallets'
import { AccountDetails, CurrencyCountries, TransferData } from '../types'
import { Listeners } from '@modules/core'

export class WalletsUseCase {
	repository: IWalletRepository

	constructor(repo: IWalletRepository) {
		this.repository = repo
	}

	async get() {
		return await this.repository.get()
	}

	async toggleRenewSubscription(renew: boolean) {
		return await this.repository.toggleRenewSubscription({ renew })
	}

	async subscribeToPlan(data: { planId: string; methodId: string | null }) {
		return await this.repository.subscribeToPlan(data)
	}

	async renewPlan() {
		return await this.repository.renewPlan()
	}

	async updateAccountNumber(factory: AccountUpdateFactory) {
		return await this.repository.updateAccountNumber(await factory.toModel())
	}

	async transfer(data: TransferData) {
		return await this.repository.transfer(data)
	}

	async withdraw(factory: WithdrawalFactory) {
		return await this.repository.withdraw(await factory.toModel())
	}

	async verifyAccountNumber(data: Partial<AccountDetails>) {
		return await this.repository.verifyAccountNumber(data)
	}

	async getBanks() {
		return await this.repository.getBanks(CurrencyCountries.NG)
	}

	async fund(factory: FundWalletFactory) {
		return await this.repository.fund(await factory.toModel())
	}

	async listen(listener: Listeners<WalletEntity>) {
		return await this.repository.listen(listener)
	}
}
