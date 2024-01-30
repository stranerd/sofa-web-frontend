import { AnnouncementToModel } from '../../data/models/announcements'
import { AnnouncementEntity } from '../entities/announcements'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface IAnnouncementRepository {
	add: (data: AnnouncementToModel) => Promise<AnnouncementEntity>
	get: (condition: QueryParams) => Promise<QueryResults<AnnouncementEntity>>
	find: (id: string) => Promise<AnnouncementEntity | null>
	delete: (id: string) => Promise<boolean>
	markRead: (userId: string) => Promise<boolean>
	listenToOne: (id: string, listeners: Listeners<AnnouncementEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listeners: Listeners<AnnouncementEntity>,
		matches: (entity: AnnouncementEntity) => boolean,
	) => Promise<() => void>
}
