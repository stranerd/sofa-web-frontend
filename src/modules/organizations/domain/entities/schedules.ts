import { BaseEntity } from '@modules/core'
import { ScheduleFromModel } from '../../data/models/schedules'
import { EmbeddedUser, ScheduleStatus, ScheduleStream, ScheduleTime } from '../types'

export class ScheduleEntity extends BaseEntity {
	public readonly id: string
	public readonly organizationId: string
	public readonly classId: string
	public readonly lessonId: string
	public readonly user: EmbeddedUser
	public readonly title: string
	public readonly status: ScheduleStatus
	public readonly time: ScheduleTime
	public readonly stream: ScheduleStream | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, organizationId, classId, lessonId, user, title, status, time, stream, createdAt, updatedAt }: ScheduleFromModel) {
		super()
		this.id = id
		this.organizationId = organizationId
		this.classId = classId
		this.lessonId = lessonId
		this.user = user
		this.title = title
		this.status = status
		this.time = time
		this.stream = stream
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	get isOngoing() {
		/* const now = Date.now()
		return now >= this.time.start && now <= this.time.end */
		return this.status === ScheduleStatus.started
	}
}
