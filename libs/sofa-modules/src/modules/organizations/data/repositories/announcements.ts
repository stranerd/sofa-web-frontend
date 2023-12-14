import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { apiBase } from '@utils/environment'
import { IAnnouncementRepository } from '../../domain/irepositories/announcements'
import { AnnouncementMapper } from '../mappers/announcements'
import { AnnouncementFromModel, AnnouncementToModel } from '../models/announcements'
import { AnnouncementEntity } from '../../domain/entities/announcements'

export class AnnouncementRepository implements IAnnouncementRepository {
	private static instance: AnnouncementRepository
	private client: HttpClient
	private mapper: AnnouncementMapper

	private constructor () {
		this.client = new HttpClient(apiBase + '/organizations')
		this.mapper = new AnnouncementMapper()
	}

	static getInstance () {
		if (!AnnouncementRepository.instance) AnnouncementRepository.instance = new AnnouncementRepository()
		return AnnouncementRepository.instance
	}

	async get (organizationId: string, classId: string, query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<AnnouncementFromModel>>(`/${organizationId}/classes/${classId}/announcements`, query)

		return {
			...d,
			results: d.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: AnnouncementToModel) {
		const d = await this.client.post<AnnouncementToModel, AnnouncementFromModel>(`/${data.organizationId}/classes/${data.classId}/announcements`, data)
		return this.mapper.mapFrom(d)!
	}

	async find (organizationId: string, classId: string, id: string) {
		const data = await this.client.get<QueryParams, AnnouncementFromModel | null>(`/${organizationId}/classes/${classId}/announcements/${id}`, {})
		return this.mapper.mapFrom(data)
	}

	async delete (organizationId: string, classId: string, id: string) {
		return await this.client.delete<{}, boolean>(`/${organizationId}/classes/${classId}/announcements/${id}`, {})
	}

	async markRead (organizationId: string, classId: string) {
		return await this.client.get<{}, boolean>(`/${organizationId}/classes/${classId}/announcements/`, {})
	}

	async listenToOne (organizationId: string, classId: string, id: string, listeners: Listeners<AnnouncementEntity>) {
		const listener = listenToOne(`organizations/${organizationId}/classes/${classId}/announcements${id}`, listeners, this.mapper.mapFrom)
		const model = await this.find(organizationId, classId, id)
		if (model) await listeners.updated(model)
		return listener
	}

	async listenToMany (organizationId: string, classId: string, query: QueryParams, listeners: Listeners<AnnouncementEntity>, matches: (entity: AnnouncementEntity) => boolean) {
		const listener = listenToMany(`organizations/${organizationId}/classes/${classId}/announcements`, listeners, this.mapper.mapFrom, matches)
		const models = await this.get(organizationId, classId, query)
		await Promise.all(models.results.map(listeners.updated))
		return listener
	}
}
