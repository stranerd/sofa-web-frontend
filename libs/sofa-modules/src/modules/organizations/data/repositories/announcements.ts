import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { apiBase } from '@utils/environment'
import { AnnouncementEntity } from '../../domain/entities/announcements'
import { IAnnouncementRepository } from '../../domain/irepositories/announcements'
import { AnnouncementFromModel, AnnouncementToModel } from '../models/announcements'

export class AnnouncementRepository implements IAnnouncementRepository {
	private static instances: Record<string, AnnouncementRepository> = {}
	private client: HttpClient
	private mapper = (model: AnnouncementFromModel | null) => model ? new AnnouncementEntity(model) : null

	private constructor (organizationId: string, classId: string) {
		this.client = new HttpClient(`${apiBase}/organizations/${organizationId}/classes/${classId}/announcements`)
	}

	static getInstance (organizationId: string, classId: string) {
		return AnnouncementRepository.instances[`${organizationId}-${classId}`] ??= new AnnouncementRepository(organizationId, classId)
	}

	async get (query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<AnnouncementFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)!)
		}
	}

	async add (data: AnnouncementToModel) {
		const d = await this.client.post<AnnouncementToModel, AnnouncementFromModel>('/', data)
		return this.mapper(d)!
	}

	async find (id: string) {
		const data = await this.client.get<QueryParams, AnnouncementFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async delete (id: string) {
		return await this.client.delete<{}, boolean>(`/${id}`, {})
	}

	async markRead () {
		return await this.client.post<{}, boolean>('/read', {})
	}

	async listenToOne (id: string, listeners: Listeners<AnnouncementEntity>) {
		const listener = listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return listener
	}

	async listenToMany (query: QueryParams, listeners: Listeners<AnnouncementEntity>, matches: (entity: AnnouncementEntity) => boolean) {
		const listener = listenToMany(this.client.socketPath, listeners, this.mapper, matches)
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return listener
	}
}
