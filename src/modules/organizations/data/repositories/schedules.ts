import { ScheduleEntity } from '../../domain/entities/schedules'
import { IScheduleRepository } from '../../domain/irepositories/schedules'
import { ScheduleFromModel, ScheduleToModel } from '../models/schedules'
import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'

export class ScheduleRepository implements IScheduleRepository {
	private static instances: Record<string, ScheduleRepository> = {}
	private client: HttpClient
	private mapper = (model: ScheduleFromModel | null) => (model ? new ScheduleEntity(model) : null) as ScheduleEntity

	private constructor(organizationId: string, classId: string) {
		this.client = new HttpClient(`/organizations/${organizationId}/classes/${classId}/schedules`)
	}

	static getInstance(organizationId: string, classId: string) {
		return (ScheduleRepository.instances[`${organizationId}-${classId}`] ??= new ScheduleRepository(organizationId, classId))
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<ScheduleFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async add(data: ScheduleToModel) {
		const d = await this.client.post<ScheduleToModel, ScheduleFromModel>('/', data)
		return this.mapper(d)
	}

	async update(id: string, data: ScheduleToModel) {
		const d = await this.client.put<ScheduleToModel, ScheduleFromModel>(`/${id}`, data)
		return this.mapper(d)
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, ScheduleFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async delete(id: string) {
		return await this.client.delete<unknown, boolean>(`/${id}`, {})
	}

	async start(id: string) {
		const d = await this.client.post<unknown, ScheduleFromModel>(`/${id}/start`, {})
		return this.mapper(d)
	}

	async end(id: string) {
		const d = await this.client.post<unknown, ScheduleFromModel>(`/${id}/end`, {})
		return this.mapper(d)
	}

	async listenToOne(id: string, listeners: Listeners<ScheduleEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<ScheduleEntity>, matches: (entity: ScheduleEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}
}
