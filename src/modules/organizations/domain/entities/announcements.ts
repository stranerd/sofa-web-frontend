import { AnnouncementFromModel } from '../../data/models/announcements'
import { AnnouncementFilter, EmbeddedUser } from '../types'
import { BaseEntity } from '@modules/core'

export class AnnouncementEntity extends BaseEntity {
	public readonly id: string
	public readonly organizationId: string
	public readonly classId: string
	public readonly user: EmbeddedUser
	public readonly body: string
	public readonly filter: AnnouncementFilter
	public readonly readAt: Record<string, number>
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, organizationId, classId, user, body, filter, readAt, createdAt, updatedAt }: AnnouncementFromModel) {
		super()
		this.id = id
		this.organizationId = organizationId
		this.classId = classId
		this.user = user
		this.body = body
		this.filter = filter
		this.readAt = readAt
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
