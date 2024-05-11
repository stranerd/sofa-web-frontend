import { CourseSection } from '@modules/study/domain/types'

export type { Saleable } from '@modules/payment'
export type { EmbeddedUser } from '@modules/users'

export enum MemberTypes {
	teacher = 'teacher',
	student = 'student',
}

export type AnnouncementFilter = {
	lessonIds: string[] | null
	userTypes: MemberTypes[] | null
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
	curriculum: CourseSection[]
}

export type ClassMembers = {
	students: string[]
}

export enum CurriculumView {
	list = 'list',
	grid = 'grid',
}

export type ScheduleStream = {
	broadcastId: string
	stream: string
	streamKey: string
	type: 'jitsi'
	roomId: string
	canRewatch: boolean
}
