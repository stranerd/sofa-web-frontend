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
		const now = Date.now()
		const fiveMinsB4Start = this.time.start - 5 * 60 * 1000
		return this.status === ScheduleStatus.created && fiveMinsB4Start <= now && now < this.time.end
	}

	get canEnd() {
		return this.status === ScheduleStatus.started
	}

	get isOngoing() {
		return this.status === ScheduleStatus.started
	}

	get hasEnded() {
		return this.status === ScheduleStatus.ended
	}

	get canTeacherJoin() {
		return this.isOngoing
	}

	get canStudentJoin() {
		return this.isOngoing && this.time.start <= Date.now()
	}

	get meetingLink() {
		return `https://meet.jit.si/${this.stream?.roomId ?? this.id}`
	}

	get recordingLink() {
		return `https://www.youtube.com/watch?v=${this.stream?.broadcastId}`
	}

	get timeRange() {
		const { start, end } = this.time
		return `${formatTime(start, true)} &nbsp; ● &nbsp; ${getTimeString(new Date(start))} - ${getTimeString(new Date(end))}`
	}
}
