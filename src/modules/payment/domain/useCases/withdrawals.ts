import { IWithdrawalRepository } from '../irepositories/withdrawals'

export class WithdrawalsUseCase {
	repository: IWithdrawalRepository

	constructor(repo: IWithdrawalRepository) {
		this.repository = repo
	}

	async find(id: string) {
		return await this.repository.find(id)
	}
}
