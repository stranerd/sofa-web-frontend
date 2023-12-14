import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { AnnouncementToModel } from '../../data/models/announcements'
import { AnnouncementEntity } from '../entities/announcements'

export interface IAnnouncementRepository {
	add: (data: AnnouncementToModel) => Promise<AnnouncementEntity>
	get: (organizationId: string, classId: string, condition: QueryParams) => Promise<QueryResults<AnnouncementEntity>>
	find: (organizationId: string, classId: string, id: string) => Promise<AnnouncementEntity | null>
	delete: (organizationId: string, classId: string, id: string) => Promise<boolean>
	markRead: (organizationId: string, classId: string, userId: string) => Promise<boolean>
	listenToOne: (organizationId: string, classId: string, id: string, listeners: Listeners<AnnouncementEntity>) => Promise<() => void>
	listenToMany: (organizationId: string, classId: string, query: QueryParams, listeners: Listeners<AnnouncementEntity>, matches: (entity: AnnouncementEntity) => boolean) => Promise<() => void>
}