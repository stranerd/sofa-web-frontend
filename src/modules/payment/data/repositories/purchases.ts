import { PurchaseFromModel, PurchaseToModel } from '../models/purchases'
import { HttpClient, QueryParams, QueryResults } from '@modules/core'
import { IPurchaseRepository } from '@modules/payment/domain/irepositories/purchases'
import { PurchaseEntity } from '@modules/payment/domain/entities/purchases'

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
}
