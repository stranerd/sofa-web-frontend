export type { Saleable } from '@modules/payment'
export type { EmbeddedUser } from '@modules/users'

export enum MemberTypes {
	teacher = 'teacher',
	student = 'student',
}

export type AnnouncementFilter = {
	lessonId: string | null
	userType: MemberTypes | null
}

export type ScheduleTime = {
	start: number
	end: number
}

export enum ScheduleStatus {
	created = 'created',
	started = 'started',
	ended = 'ended',
}

export type LessonToModel = {
	title: string
	teachers: string[]
}

export type ClassLesson = {
	id: string
	title: string
	users: {
		students: string[]
		teachers: string[]
	}
}
