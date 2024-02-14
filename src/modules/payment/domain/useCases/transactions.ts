import { TransactionToModel } from '../../data/models/transactions'
import { ITransactionRepository } from '../irepositories/transactions'
import { QueryParams } from '@modules/core'

export class TransactionsUseCase {
	repository: ITransactionRepository

	constructor(repo: ITransactionRepository) {
		this.repository = repo
	}

	async get(input: QueryParams) {
		return await this.repository.get(input)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async create(data: TransactionToModel) {
		return await this.repository.create(data)
	}

	async update(id: string, data: TransactionToModel) {
		return await this.repository.update(id, data)
	}
}
