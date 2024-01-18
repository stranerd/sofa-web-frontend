import { AnnouncementFilter, EmbeddedUser } from '../../domain/types'

export interface AnnouncementFromModel extends AnnouncementToModel {
	id: string
	readAt: Record<string, number>
	createdAt: number
	updatedAt: number
	organizationId: string
	classId: string
	user: EmbeddedUser
}

export interface AnnouncementToModel {
	filter: AnnouncementFilter
	body: string
}
