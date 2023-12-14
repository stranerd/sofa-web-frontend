import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { apiBase } from '@utils/environment'
import { ClassEntity } from '../../domain/entities/classes'
import { IClassRepository } from '../../domain/irepositories/classes'
import { ClassMapper } from '../mappers/classes'
import { ClassFromModel, ClassToModel } from '../models/classes'

export class ClassRepository implements IClassRepository {
	private static instance: ClassRepository
	private client: HttpClient
	private mapper: ClassMapper

	private constructor () {
		this.client = new HttpClient(apiBase + '/organizations')
		this.mapper = new ClassMapper()
	}

	static getInstance () {
		if (!ClassRepository.instance) ClassRepository.instance = new ClassRepository()
		return ClassRepository.instance
	}

	async get (organizationId: string, query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<ClassFromModel>>(`/${organizationId}/classes`, query)

		return {
			...d,
			results: d.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async listenToOne (organizationId: string, id: string, listeners: Listeners<ClassEntity>) {
		const listener = listenToOne(`organizations/${organizationId}/classes/${id}`, listeners, this.mapper.mapFrom)
		const model = await this.find(organizationId, id)
		if (model) await listeners.updated(model)
		return listener
	}

	async listenToMany (organizationId: string, query: QueryParams, listeners: Listeners<ClassEntity>, matches: (entity: ClassEntity) => boolean) {
		const listener = listenToMany(`organizations/${organizationId}/classes`, listeners, this.mapper.mapFrom, matches)
		const models = await this.get(organizationId, query)
		await Promise.all(models.results.map(listeners.updated))
		return listener
	}

	async add (data: ClassToModel) {
		const d = await this.client.post<ClassToModel, ClassFromModel>(`/${data.organizationId}/classes`, data)
		return this.mapper.mapFrom(d)!
	}

	async find (organizationId: string, id: string) {
		const d = await this.client.get<QueryParams, ClassFromModel | null>(`/${organizationId}/classes/${id}`, {})
		return this.mapper.mapFrom(d)
	}

	async delete (organizationId: string, id: string) {
		return await this.client.delete<{}, boolean>(`/${organizationId}/classes/${id}`, {})
	}

	async update (organizationId: string, id: string, data: ClassToModel) {
		const d = await this.client.put<ClassToModel, ClassFromModel>(`/${organizationId}/classes/${id}`, data)
		return this.mapper.mapFrom(d)!
	}
}
