import { TransactionEntity } from '../../domain/entities/transactions'
import { ITransactionRepository } from '../../domain/irepositories/transactions'
import { TransactionFromModel, TransactionToModel } from '../models/transactions'
import { FlutterwaveSecrets } from '../../domain/types'
import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'

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

	async getFlutterwaveSecrets() {
		return await this.client.get<any, FlutterwaveSecrets>('/flutterwave/secrets', {})
	}

	async fulfill(id: string) {
		return await this.client.put<any, boolean>(`/${id}/fulfill`, {})
	}
}
