import { ClassEntity } from '../../domain/entities/classes'
import { IClassRepository } from '../../domain/irepositories/classes'
import { ClassFromModel, ClassToModel } from '../models/classes'
import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'

export class ClassRepository implements IClassRepository {
	private static instances: Record<string, ClassRepository> = {}
	private client: HttpClient
	private exploreClient: HttpClient
	private mapper = (model: ClassFromModel | null) => (model ? new ClassEntity(model) : null) as ClassEntity

	private constructor(organizationId: string) {
		this.client = new HttpClient(`/organizations/${organizationId}/classes`)
		this.exploreClient = new HttpClient('/organizations/classes')
	}

	static getInstance(organizationId: string) {
		return (ClassRepository.instances[organizationId] ??= new ClassRepository(organizationId))
	}

	async explore(query: QueryParams) {
		const d = await this.exploreClient.get<QueryParams, QueryResults<ClassFromModel>>('/explore', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<ClassFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async listenToOne(id: string, listeners: Listeners<ClassEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<ClassEntity>, matches: (entity: ClassEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async add(data: ClassToModel) {
		const d = await this.client.post<ClassToModel, ClassFromModel>('/', data)
		return this.mapper(d)
	}

	async find(id: string) {
		const d = await this.client.get<QueryParams, ClassFromModel | null>(`/${id}`, {})
		return this.mapper(d)
	}

	async delete(id: string) {
		return await this.client.delete<unknown, boolean>(`/${id}`, {})
	}

	async update(id: string, data: ClassToModel) {
		const d = await this.client.put<ClassToModel, ClassFromModel>(`/${id}`, data)
		return this.mapper(d)
	}

	async purchase(id: string) {
		return await this.client.post<unknown, boolean>(`/${id}/purchase`, {})
	}

	async cancelPurchase(id: string) {
		return await this.client.delete<unknown, boolean>(`/${id}/purchase`, {})
	}
}
