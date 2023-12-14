import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { apiBase } from '@utils/environment'
import { ILessonRepository } from '../../domain/irepositories/lessons'
import { LessonMapper } from '../mappers/lessons'
import { LessonFromModel, LessonToModel } from '../models/lessons'
import { LessonEntity } from '../../domain/entities/lessons'

export class LessonRepository implements ILessonRepository {
	private static instance: LessonRepository
	private client: HttpClient
	private mapper: LessonMapper

	private constructor () {
		this.client = new HttpClient(apiBase + '/organizations')
		this.mapper = new LessonMapper()
	}

	static getInstance () {
		if (!LessonRepository.instance) LessonRepository.instance = new LessonRepository()
		return LessonRepository.instance
	}

	async get (organizationId: string, classId: string, query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<LessonFromModel>>(`/${organizationId}/classes/${classId}/lessons`, query)

		return {
			...d,
			results: d.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: LessonToModel) {
		const d = await this.client.post<LessonToModel, LessonFromModel>(`/${data.organizationId}/classes/${data.classId}/lessons`, data)
		return this.mapper.mapFrom(d)!
	}

	async update (organizationId: string, classId: string, id: string, data: LessonToModel) {
		const d = await this.client.put<LessonToModel, LessonFromModel>(`/${organizationId}/classes/${classId}/lessons/${id}`, data)
		return this.mapper.mapFrom(d)!
	}

	async find (organizationId: string, classId: string, id: string) {
		const data = await this.client.get<QueryParams, LessonFromModel | null>(`/${organizationId}/classes/${classId}/lessons/${id}`, {})
		return this.mapper.mapFrom(data)
	}

	async delete (organizationId: string, classId: string, id: string) {
		return await this.client.delete<{}, boolean>(`/${organizationId}/classes/${classId}/lessons/${id}`, {})
	}

	async listenToOne (organizationId: string, classId: string, id: string, listeners: Listeners<LessonEntity>) {
		const listener = listenToOne(`organizations/${organizationId}/classes/${classId}/lessons${id}`, listeners, this.mapper.mapFrom)
		const model = await this.find(organizationId, classId, id)
		if (model) await listeners.updated(model)
		return listener
	}

	async listenToMany (organizationId: string, classId: string, query: QueryParams, listeners: Listeners<LessonEntity>, matches: (entity: LessonEntity) => boolean) {
		const listener = listenToMany(`organizations/${organizationId}/classes/${classId}/lessons`, listeners, this.mapper.mapFrom, matches)
		const models = await this.get(organizationId, classId, query)
		await Promise.all(models.results.map(listeners.updated))
		return listener
	}

	async join (data: { organizationId: string, classId: string, id: string, join: boolean }) {
		const d = await this.client.post<{ join: boolean }, LessonFromModel>(`/${data.organizationId}/classes/${data.classId}/lessons/${data.id}/members/join`, { join: data.join })
		return this.mapper.mapFrom(d)!
	}

	async manageTeachers (data: { organizationId: string, classId: string, id: string, userId: string, add: boolean }) {
		const d = await this.client.post<{ userId: string, add: boolean }, LessonFromModel>(`/${data.organizationId}/classes/${data.classId}/lessons/${data.id}/members/teachers`, { userId: data.userId, add: data.add })
		return this.mapper.mapFrom(d)!
	}
}
