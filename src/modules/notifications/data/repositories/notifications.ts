import { NotificationEntity } from '../../domain/entities/notifications'
import { INotificationRepository } from '../../domain/irepositories/notifications'
import { NotificationFromModel } from '../models/notifications'
import { ToggleNotificationSeen } from '../../domain/types'
import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'

export class NotificationRepository implements INotificationRepository {
	private static instance: NotificationRepository
	private client: HttpClient
	private mapper = (model: NotificationFromModel | null) => (model ? new NotificationEntity(model) : null) as NotificationEntity

	private constructor() {
		this.client = new HttpClient('/notifications/notifications')
	}

	static getInstance() {
		if (!NotificationRepository.instance) NotificationRepository.instance = new NotificationRepository()
		return NotificationRepository.instance
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<NotificationFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, NotificationFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async toggleSeen(id: string, data: ToggleNotificationSeen) {
		return await this.client.put<ToggleNotificationSeen, boolean>(`/${id}/seen`, data)
	}

	async toggleAllSeen(data: ToggleNotificationSeen) {
		return await this.client.put<ToggleNotificationSeen, boolean>('/seen', data)
	}

	async listenToOne(id: string, listeners: Listeners<NotificationEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<NotificationEntity>, matches: (entity: NotificationEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}
}
