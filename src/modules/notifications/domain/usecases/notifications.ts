import { NotificationEntity } from '../entities/notifications'
import { INotificationRepository } from '../irepositories/notifications'
import { Conditions, Listeners, QueryParams } from '@modules/core'

export class NotificationsUseCase {
	private repository: INotificationRepository

	constructor(repository: () => INotificationRepository) {
		this.repository = repository()
	}

	async get(date?: number) {
		const conditions: QueryParams = {
			sort: [{ field: 'createdAt', desc: true }],
			limit: $utils.constants.DEFAULT_PAGINATION_LIMIT,
		}
		if (date) conditions.where = [{ field: 'createdAt', condition: Conditions.lt, value: date }]
		return await this.repository.get(conditions)
	}

	async listen(listener: Listeners<NotificationEntity>, date?: number) {
		const conditions: QueryParams = {
			sort: [{ field: 'createdAt', desc: true }],
			all: true,
		}
		if (date) conditions.where = [{ field: 'createdAt', condition: Conditions.gt, value: date }]

		return await this.repository.listenToMany(conditions, listener, (entity) => {
			if (date) return entity.createdAt >= date
			else return true
		})
	}

	async getUnReadCount() {
		const res = await this.repository.get({
			where: [{ field: 'seen', value: false }],
			limit: 1,
		})
		return res.docs.total
	}

	async toggleSeen(id: string, seen: boolean) {
		return await this.repository.toggleSeen(id, { seen })
	}
}
