import { MethodEntity } from '../../domain/entities/methods'
import { IMethodRepository } from '../../domain/irepositories/methods'
import { MethodFromModel } from '../models/methods'
import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'

export class MethodRepository implements IMethodRepository {
	private static instance: MethodRepository
	private client: HttpClient
	private mapper = (model: MethodFromModel | null) => (model ? new MethodEntity(model) : null) as MethodEntity

	private constructor() {
		this.client = new HttpClient('/payment/methods')
	}

	static getInstance() {
		if (!MethodRepository.instance) MethodRepository.instance = new MethodRepository()
		return MethodRepository.instance
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<MethodFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, MethodFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async makePrimary(id: string) {
		const data = await this.client.post<QueryParams, MethodFromModel>(`/${id}/primary`, {})
		return this.mapper(data)
	}

	async delete(id: string) {
		return await this.client.delete<unknown, boolean>(`/${id}`, {})
	}

	async listenToOne(id: string, listeners: Listeners<MethodEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<MethodEntity>, matches: (entity: MethodEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}
}
