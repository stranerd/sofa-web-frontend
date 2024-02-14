import { PurchaseEntity } from '../../domain/entities/purchases'
import { IPurchaseRepository } from '../../domain/irepositories/purchases'
import { PurchaseFromModel, PurchaseToModel } from '../models/purchases'
import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'

export class PurchaseRepository implements IPurchaseRepository {
	private static instance: PurchaseRepository
	private client: HttpClient
	private mapper = (model: PurchaseFromModel | null) => (model ? new PurchaseEntity(model) : null) as PurchaseEntity

	private constructor() {
		this.client = new HttpClient('/payment/purchases')
	}

	static getInstance() {
		if (!PurchaseRepository.instance) PurchaseRepository.instance = new PurchaseRepository()
		return PurchaseRepository.instance
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<PurchaseFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, PurchaseFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async create(data: PurchaseToModel) {
		const d = await this.client.post<PurchaseToModel, PurchaseFromModel>('/', data)
		return this.mapper(d)
	}

	async listenToOne(id: string, listeners: Listeners<PurchaseEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<PurchaseEntity>, matches: (entity: PurchaseEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}
}
