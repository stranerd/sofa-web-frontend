export type { Saleable } from '@modules/payment'
export type { EmbeddedUser } from '@modules/users'

export enum MemberTypes {
	teacher = 'teacher',
	student = 'student'
}

export type AnnouncementFilter = {
	lessonId: string | null
	userType: MemberTypes | null
}

export type ScheduleTime = {
	start: number
	end: number
}

export type LessonMembers = {
	students: string[]
	teachers: string[]
}