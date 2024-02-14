import { TransactionFromModel, TransactionToModel } from '../models/transactions'
import { HttpClient, QueryParams, QueryResults, Listeners, listenToMany, listenToOne } from '@modules/core'
import { ITransactionRepository } from '@modules/payment/domain/irepositories/transactions'
import { TransactionEntity } from '@modules/payment/domain/entities/transactions'

export class TransactionRepository implements ITransactionRepository {
	private static instance: TransactionRepository
	private client: HttpClient
	private mapper = (model: TransactionFromModel | null) => (model ? new TransactionEntity(model) : null) as TransactionEntity

	private constructor() {
		this.client = new HttpClient('/payment/transactions')
	}

	static getInstance() {
		if (!TransactionRepository.instance) TransactionRepository.instance = new TransactionRepository()
		return TransactionRepository.instance
	}

	async create(data: TransactionToModel) {
		const d = await this.client.post<TransactionToModel, TransactionFromModel>('/', data)
		return this.mapper(d)
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<TransactionFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, TransactionFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async update(id: string, data: TransactionToModel) {
		const d = await this.client.put<TransactionToModel, TransactionFromModel>(`/${id}`, data)
		return this.mapper(d)
	}

	async listenToOne(id: string, listeners: Listeners<TransactionEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<TransactionEntity>, matches: (entity: TransactionEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}
}
