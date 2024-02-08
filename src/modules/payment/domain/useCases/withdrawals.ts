import { IWithdrawalRepository } from '../irepositories/withdrawals'
import { QueryParams } from '@modules/core'

export class WithdrawalsUseCase {
	repository: IWithdrawalRepository

	constructor(repo: IWithdrawalRepository) {
		this.repository = repo
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}
}
