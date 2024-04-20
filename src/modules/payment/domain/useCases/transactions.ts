import { TransactionToModel } from '../../data/models/transactions'
import { TransactionEntity } from '../entities/transactions'
import { ITransactionRepository } from '../irepositories/transactions'
import { TransactionStatus } from '../types'
import { Listeners, QueryParams, Conditions } from '@modules/core'

export class TransactionsUseCase {
	repository: ITransactionRepository

	constructor(repo: ITransactionRepository) {
		this.repository = repo
	}

	async getFlutterwaveSecrets() {
		return this.repository.getFlutterwaveSecrets()
	}

	async create(data: TransactionToModel) {
		return await this.repository.create(data)
	}

	async fulfill(id: string) {
		return await this.repository.fulfill(id)
	}

	async get(date?: number) {
		const conditions: QueryParams = {
			where: [{ field: 'status', condition: Conditions.ne, value: TransactionStatus.initialized }],
			sort: [{ field: 'createdAt', desc: true }],
			limit: $utils.constants.DEFAULT_PAGINATION_LIMIT,
		}
		if (date) conditions.where!.push({ field: 'createdAt', condition: Conditions.lt, value: date })
		return await this.repository.get(conditions)
	}

	async listen(listeners: Listeners<TransactionEntity>, date?: number) {
		const conditions: QueryParams = {
			where: [{ field: 'status', condition: Conditions.ne, value: TransactionStatus.initialized }],
			sort: [{ field: 'createdAt', desc: true }],
			all: true,
		}
		if (date) conditions.where!.push({ field: 'createdAt', condition: Conditions.gt, value: date })

		return await this.repository.listenToMany(conditions, listeners, (entity) => {
			if (date) return entity.createdAt >= date
			else return entity.status !== TransactionStatus.initialized
		})
	}
}
