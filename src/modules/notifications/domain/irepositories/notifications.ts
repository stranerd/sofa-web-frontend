import { NotificationEntity } from '../entities/notifications'
import { ToggleNotificationSeen } from '../types'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface INotificationRepository {
	get: (condition: QueryParams) => Promise<QueryResults<NotificationEntity>>
	find: (id: string) => Promise<NotificationEntity | null>
	toggleSeen: (id: string, data: ToggleNotificationSeen) => Promise<boolean>
	toggleAllSeen: (data: ToggleNotificationSeen) => Promise<boolean>
	listenToOne: (id: string, listeners: Listeners<NotificationEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listeners: Listeners<NotificationEntity>,
		matches: (entity: NotificationEntity) => boolean,
	) => Promise<() => void>
}
