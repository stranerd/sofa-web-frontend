import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { apiBase } from '@utils/environment'
import { CourseEntity } from '../../domain/entities/courses'
import { ICourseRepository } from '../../domain/irepositories/icourses'
import { CourseFromModel, CourseToModel } from '../models/courses'

export class CourseRepository implements ICourseRepository {
	private static instance: CourseRepository
	private client: HttpClient
	private mapper = (model: CourseFromModel | null) => (model ? new CourseEntity(model) : null)

	constructor() {
		this.client = new HttpClient(`${apiBase}/school/courses`)
	}

	static getInstance() {
		if (!CourseRepository.instance) CourseRepository.instance = new CourseRepository()
		return CourseRepository.instance
	}

	async add(data: CourseToModel) {
		const d = await this.client.post<CourseToModel, CourseFromModel>('/', data)
		return this.mapper(d)
	}

	async find(id: string) {
		const d = await this.client.get<any, CourseFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<CourseFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper),
		}
	}

	async listenToOne(id: string, listeners: Listeners<CourseEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<CourseEntity>, matches: (entity: CourseEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async delete(id: string) {
		await this.client.delete<any, boolean>(`/${id}`, {})
	}

	async update(id: string, data: CourseToModel) {
		const d = await this.client.put<CourseToModel, CourseFromModel>(`/${id}`, data)
		return this.mapper(d)
	}
}
