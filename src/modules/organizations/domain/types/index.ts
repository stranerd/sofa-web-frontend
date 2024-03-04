import { ScheduleEntity } from '../entities/schedules'
import { PlayTypes } from '@modules/plays'
import { FileEntity, FileType, QuizEntity } from '@modules/study'

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
	curriculum: ClassLessonCurriculumSection[]
}

export type ClassMembers = {
	students: string[]
}

export enum ClassLessonable {
	quiz = 'quiz',
	file = 'file',
	schedule = 'schedule',
}

export enum CurriculumView {
	list = 'list',
	grid = 'grid',
}

type ClassLessonCurriculumSectionItem =
	| {
			id: string
			type: ClassLessonable.quiz
			quizMode: PlayTypes
	  }
	| {
			id: string
			type: ClassLessonable.file
			fileType: FileType
	  }
	| {
			id: string
			type: ClassLessonable.schedule
	  }

export type ClassLessonCurriculumSection = {
	label: string
	items: ClassLessonCurriculumSectionItem[]
}

export type ScheduleStream = {
	broadcastId: string
	stream: string
	streamKey: string
	type: 'jitsi'
	roomId: string
	canRewatch: boolean
}

export type ExtendedClassLessonCurriculumSectionItem =
	| {
			id: string
			type: ClassLessonable.quiz
			quizMode: PlayTypes
			quiz: QuizEntity
	  }
	| {
			id: string
			type: ClassLessonable.file
			fileType: FileType
			file: FileEntity
	  }
	| {
			id: string
			type: ClassLessonable.schedule
			schedule: ScheduleEntity
	  }

export type ExtendedCurriculum = (Omit<ClassLessonCurriculumSection, 'items'> & { items: ExtendedClassLessonCurriculumSectionItem[] })[]
