import { ScheduleFromModel } from '../../data/models/schedules'
import { ScheduleStatus } from '../types'
import { ClassEntity } from './classes'
import { formatTime, getTimeString } from '@utils/dates'
import { BaseEntity } from '@modules/core'

export class ScheduleEntity extends BaseEntity<ScheduleFromModel> {
	constructor(data: ScheduleFromModel) {
		super(data)
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

	canJoin(classInst: ClassEntity, userId: string) {
		if (this.status !== ScheduleStatus.started) return false
		if (!this.stream?.roomId) return false
		const lesson = classInst.getLesson(this.lessonId)
		if (!lesson) return false
		const isTeacher = lesson.users.teachers.includes(userId)
		if (isTeacher) return true
		return this.time.start <= Date.now()
	}

	canWatch() {
		return this.stream?.canRewatch ?? false
	}

	get live() {
		return this.status === ScheduleStatus.started
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

	search(query: string) {
		return [this.title, this.description].some((value) => value.toLowerCase().includes(query.toLowerCase()))
	}
}
