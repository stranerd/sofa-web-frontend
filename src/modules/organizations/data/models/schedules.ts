import { EmbeddedUser, ScheduleStatus, ScheduleStream, ScheduleTime } from '../../domain/types'

export interface ScheduleFromModel extends ScheduleToModel {
	id: string
	organizationId: string
	classId: string
	user: EmbeddedUser
	status: ScheduleStatus
	stream: ScheduleStream | null
	createdAt: number
	updatedAt: number
}

export interface ScheduleToModel {
	lessonId: string
	title: string
	description: string
	time: ScheduleTime
}
