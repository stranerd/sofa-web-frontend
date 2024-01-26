import { EmbeddedUser, ScheduleStatus, ScheduleTime } from '../../domain/types'

export interface ScheduleFromModel extends ScheduleToModel {
	id: string
	organizationId: string
	classId: string
	user: EmbeddedUser
	status: ScheduleStatus
	createdAt: number
	updatedAt: number
}

export interface ScheduleToModel {
	lessonId: string
	title: string
	time: ScheduleTime
}
