import { ScheduleFromModel } from '../../data/models/schedules'
import { EmbeddedUser, ScheduleStatus, ScheduleStream, ScheduleTime } from '../types'
import { BaseEntity } from '@modules/core'
import { formatTime, getTimeString } from '@utils/dates'

export class ScheduleEntity extends BaseEntity {
	public readonly id: string
	public readonly organizationId: string
	public readonly classId: string
	public readonly lessonId: string
	public readonly user: EmbeddedUser
	public readonly title: string
	public readonly description: string
	public readonly status: ScheduleStatus
	public readonly time: ScheduleTime
	public readonly stream: ScheduleStream | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({
		id,
		organizationId,
		classId,
		lessonId,
		user,
		title,
		description,
		status,
		time,
		stream,
		createdAt,
		updatedAt,
	}: ScheduleFromModel) {
		super()
		this.id = id
		this.organizationId = organizationId
		this.classId = classId
		this.lessonId = lessonId
		this.user = user
		this.title = title
		this.description = description
		this.status = status
		this.time = time
		this.stream = stream
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	get canStart() {
		return this.status === ScheduleStatus.created && this.time.start <= Date.now()
	}

	get canEnd() {
		return this.status === ScheduleStatus.started
	}

	get isOngoing() {
		return this.status === ScheduleStatus.started
	}

	get meetingLink() {
		return `https://meet.jit.si/${this.stream?.roomId ?? this.id}`
	}

	get timeRange() {
		const { start, end } = this.time
		return `${formatTime(start)} &nbsp; ● &nbsp; ${getTimeString(new Date(start))} - ${getTimeString(new Date(end))}`
	}
}
