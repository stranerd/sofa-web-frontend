import { PlanFromModel } from '../models/plans'
import { HttpClient, QueryParams, QueryResults, Listeners, listenToMany, listenToOne } from '@modules/core'
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

	async listenToOne(id: string, listeners: Listeners<PlanEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<PlanEntity>, matches: (entity: PlanEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}
}
