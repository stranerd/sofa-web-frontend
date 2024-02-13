import { ScheduleFromModel } from '../../data/models/schedules'
import { EmbeddedUser, ScheduleStatus, ScheduleStream, ScheduleTime } from '../types'
import { ClassEntity } from './classes'
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

	canStart(classInst: ClassEntity, userId: string) {
		if (this.status !== ScheduleStatus.created) return false
		const lesson = classInst.getLesson(this.lessonId)
		if (!lesson) return false
		const isTeacher = lesson.users.teachers.includes(userId)
		if (!isTeacher) return false
		const now = Date.now()
		const fiveMinsB4Start = this.time.start - 5 * 60 * 1000
		return fiveMinsB4Start <= now && now < this.time.end
	}

	canEnd(classInst: ClassEntity, userId: string) {
		if (this.status !== ScheduleStatus.started) return false
		const lesson = classInst.getLesson(this.lessonId)
		if (!lesson) return false
		const isTeacher = lesson.users.teachers.includes(userId)
		return isTeacher
	}

	get hasEnded() {
		return this.status === ScheduleStatus.ended
	}

	canJoin(classInst: ClassEntity, userId: string) {
		if (this.status !== ScheduleStatus.started) return false
		const lesson = classInst.getLesson(this.lessonId)
		if (!lesson) return false
		const isTeacher = lesson.users.teachers.includes(userId)
		if (isTeacher) return true
		return this.time.start <= Date.now()
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
