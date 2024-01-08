import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { LessonEntity } from '../../domain/entities/lessons'
import { ILessonRepository } from '../../domain/irepositories/lessons'
import { LessonFromModel, LessonToModel } from '../models/lessons'

export class LessonRepository implements ILessonRepository {
	private static instances: Record<string, LessonRepository> = {}
	private client: HttpClient
	private mapper = (model: LessonFromModel | null) => (model ? new LessonEntity(model) : null)

	private constructor(organizationId: string, classId: string) {
		this.client = new HttpClient(`/organizations/${organizationId}/classes/${classId}/lessons`)
	}

	static getInstance(organizationId: string, classId: string) {
		return (LessonRepository.instances[`${organizationId}-${classId}`] ??= new LessonRepository(organizationId, classId))
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<LessonFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)!),
		}
	}

	async add(data: LessonToModel) {
		const d = await this.client.post<LessonToModel, LessonFromModel>('/', data)
		return this.mapper(d)!
	}

	async update(id: string, data: LessonToModel) {
		const d = await this.client.put<LessonToModel, LessonFromModel>(`/${id}`, data)
		return this.mapper(d)!
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, LessonFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async delete(id: string) {
		return await this.client.delete<unknown, boolean>(`/${id}`, {})
	}

	async listenToOne(id: string, listeners: Listeners<LessonEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<LessonEntity>, matches: (entity: LessonEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async join(data: { id: string; join: boolean }) {
		const d = await this.client.post<{ join: boolean }, LessonFromModel>(`/${data.id}/members/join`, {
			join: data.join,
		})
		return this.mapper(d)!
	}

	async manageTeachers(data: { id: string; userId: string; add: boolean }) {
		const d = await this.client.post<{ userId: string; add: boolean }, LessonFromModel>(`/${data.id}/members/teachers`, {
			userId: data.userId,
			add: data.add,
		})
		return this.mapper(d)!
	}
}
