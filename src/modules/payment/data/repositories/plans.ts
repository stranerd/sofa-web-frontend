import { PlanFromModel } from '../models/plans'
import { HttpClient, QueryParams, QueryResults } from '@modules/core'
import { IPlanRepository } from '@modules/payment/domain/irepositories/plans'
import { PlanEntity } from '@modules/payment/domain/entities/plans'

export class PlanRepository implements IPlanRepository {
	private static instance: PlanRepository
	private client: HttpClient
	private mapper = (model: PlanFromModel | null) => (model ? new PlanEntity(model) : null) as PlanEntity

	private constructor() {
		this.client = new HttpClient('/payment/plans')
	}

	static getInstance() {
		if (!PlanRepository.instance) PlanRepository.instance = new PlanRepository()
		return PlanRepository.instance
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<PlanFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}
	async find(id: string) {
		const data = await this.client.get<QueryParams, PlanFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}
}
