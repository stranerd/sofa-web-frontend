import { TransactionToModel } from '../../data/models/transactions'
import { TransactionEntity } from '../entities/transactions'
import { ITransactionRepository } from '../irepositories/transactions'
import { Listeners, QueryParams, Conditions } from '@modules/core'
import { CHAT_PAGINATION_LIMIT } from '@utils/constants'

export class TransactionsUseCase {
	repository: ITransactionRepository

	constructor(repo: ITransactionRepository) {
		this.repository = repo
	}

	async get(date?: number) {
		const conditions: QueryParams = {
			where: [],
			sort: [{ field: 'createdAt', desc: true }],
			limit: CHAT_PAGINATION_LIMIT,
		}
		if (date) conditions.where!.push({ field: 'createdAt', condition: Conditions.lt, value: date })
		return await this.repository.get(conditions)
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

	async listen(listeners: Listeners<TransactionEntity>, date?: number) {
		const conditions: QueryParams = {
			where: [],
			sort: [{ field: 'createdAt', desc: true }],
			all: true,
		}
		if (date) conditions.where!.push({ field: 'createdAt', condition: Conditions.gt, value: date })

		return await this.repository.listenToMany(conditions, listeners, (entity) => {
			if (date) return entity.createdAt >= date
			else return true
		})
	}
}
