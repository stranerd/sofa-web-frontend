import { BaseEntity } from '@modules/core'
import { ScheduleFromModel } from '../../data/models/schedules'
import { EmbeddedUser, ScheduleStatus, ScheduleTime } from '../types'

export class ScheduleEntity extends BaseEntity {
	public readonly id: string
	public readonly organizationId: string
	public readonly classId: string
	public readonly lessonId: string
	public readonly user: EmbeddedUser
	public readonly title: string
	public readonly status: ScheduleStatus
	public readonly time: ScheduleTime
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, organizationId, classId, lessonId, user, title, status, time, createdAt, updatedAt }: ScheduleFromModel) {
		super()
		this.id = id
		this.organizationId = organizationId
		this.classId = classId
		this.lessonId = lessonId
		this.user = user
		this.title = title
		this.status = status
		this.time = time
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
