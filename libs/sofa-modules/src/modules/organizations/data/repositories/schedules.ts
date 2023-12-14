import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { apiBase } from '@utils/environment'
import { IScheduleRepository } from '../../domain/irepositories/schedules'
import { ScheduleMapper } from '../mappers/schedules'
import { ScheduleFromModel, ScheduleToModel } from '../models/schedules'
import { ScheduleEntity } from '../../domain/entities/schedules'

export class ScheduleRepository implements IScheduleRepository {
	private static instance: ScheduleRepository
	private client: HttpClient
	private mapper: ScheduleMapper

	private constructor () {
		this.client = new HttpClient(apiBase + '/organizations')
		this.mapper = new ScheduleMapper()
	}

	static getInstance () {
		if (!ScheduleRepository.instance) ScheduleRepository.instance = new ScheduleRepository()
		return ScheduleRepository.instance
	}

	async get (organizationId: string, classId: string, query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<ScheduleFromModel>>(`/${organizationId}/classes/${classId}/schedules`, query)

		return {
			...d,
			results: d.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: ScheduleToModel) {
		const d = await this.client.post<ScheduleToModel, ScheduleFromModel>(`/${data.organizationId}/classes/${data.classId}/schedules`, data)
		return this.mapper.mapFrom(d)!
	}

	async update (organizationId: string, classId: string, id: string, data: ScheduleToModel) {
		const d = await this.client.put<ScheduleToModel, ScheduleFromModel>(`/${organizationId}/classes/${classId}/schedules/${id}`, data)
		return this.mapper.mapFrom(d)!
	}

	async find (organizationId: string, classId: string, id: string) {
		const data = await this.client.get<QueryParams, ScheduleFromModel | null>(`/${organizationId}/classes/${classId}/schedules/${id}`, {})
		return this.mapper.mapFrom(data)
	}

	async delete (organizationId: string, classId: string, id: string) {
		return await this.client.delete<{}, boolean>(`/${organizationId}/classes/${classId}/schedules/${id}`, {})
	}

	async listenToOne (organizationId: string, classId: string, id: string, listeners: Listeners<ScheduleEntity>) {
		const listener = listenToOne(`organizations/${organizationId}/classes/${classId}/schedules${id}`, listeners, this.mapper.mapFrom)
		const model = await this.find(organizationId, classId, id)
		if (model) await listeners.updated(model)
		return listener
	}

	async listenToMany (organizationId: string, classId: string, query: QueryParams, listeners: Listeners<ScheduleEntity>, matches: (entity: ScheduleEntity) => boolean) {
		const listener = listenToMany(`organizations/${organizationId}/classes/${classId}/schedules`, listeners, this.mapper.mapFrom, matches)
		const models = await this.get(organizationId, classId, query)
		await Promise.all(models.results.map(listeners.updated))
		return listener
	}
}
