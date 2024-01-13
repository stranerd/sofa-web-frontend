import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { ViewEntity } from '../../domain/entities/views'
import { IViewRepository } from '../../domain/irepositories/views'
import { ViewFromModel, ViewToModel } from '../models/views'

export class ViewRepository implements IViewRepository {
	private static instance: ViewRepository
	private client: HttpClient
	private mapper = (model: ViewFromModel | null) => (model ? new ViewEntity(model) : null) as ViewEntity

	constructor() {
		this.client = new HttpClient('/interactions/views')
	}

	static getInstance() {
		if (!ViewRepository.instance) ViewRepository.instance = new ViewRepository()
		return ViewRepository.instance
	}

	async add(data: ViewToModel) {
		const d = await this.client.post<ViewToModel, ViewFromModel>('/', data)
		return this.mapper(d)
	}

	async find(id: string) {
		const d = await this.client.get<any, ViewFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<ViewFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper),
		}
	}

	async listenToOne(id: string, listeners: Listeners<ViewEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<ViewEntity>, matches: (entity: ViewEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async delete(id: string) {
		await this.client.delete<any, boolean>(`/${id}`, {})
	}

	async update(id: string, data: ViewToModel) {
		const d = await this.client.put<ViewToModel, ViewFromModel>(`/${id}`, data)
		return this.mapper(d)
	}
}
