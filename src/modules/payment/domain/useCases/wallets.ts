import { IWalletRepository } from '../irepositories/wallets'
import { AccountDetails, FundDetails, TransferData, WithdrawData } from '../types'
import { WalletEntity } from '../entities/wallets'
import { Listeners } from '@modules/core'

export class WalletsUseCase {
	repository: IWalletRepository

	constructor(repo: IWalletRepository) {
		this.repository = repo
	}

	async get() {
		return await this.repository.get()
	}

	async toggleRenewSubscription(data: { renew: boolean }) {
		return await this.repository.toggleRenewSubscription(data)
	}

	async updateAccountNumber(data: AccountDetails) {
		return await this.repository.updateAccountNumber(data)
	}

	async transfer(data: TransferData) {
		return await this.repository.transfer(data)
	}

	async withdraw(data: WithdrawData) {
		return await this.repository.withdraw(data)
	}

	async verifyAccountNumber(data: AccountDetails) {
		return await this.repository.verifyAccountNumber(data)
	}

	async getBanks() {
		return await this.repository.getBanks()
	}

	async fundWallet(data: FundDetails) {
		return await this.repository.fundWallet(data)
	}

	async listen(listener: Listeners<WalletEntity>) {
		return await this.repository.listenToOne(listener)
	}
}
