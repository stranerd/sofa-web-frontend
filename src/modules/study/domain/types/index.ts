export type { Saleable } from '@modules/payment'
export * from './questions'
import type { FileEntity } from '../entities/files'
import type { QuizEntity } from '../entities/quizzes'
import { Media, Ratings } from '@modules/core'
import { EmbeddedUser } from '@modules/users'

export type StudyKeys = 'rated' | 'popular' | 'latest' | 'suggested' | 'recent' | 'byMyOrgs'

export enum FileType {
	video = 'video',
	image = 'image',
	document = 'document',
}

export enum FolderSaved {
	courses = 'courses',
	quizzes = 'quizzes',
	files = 'files',
}

export enum DraftStatus {
	draft = 'draft',
	published = 'published',
}

export type Publishable = {
	title: string
	description: string
	photo: Media | null
	user: EmbeddedUser
	topicId: string
	tagIds: string[]
	ratings: Ratings
	status: DraftStatus
}

export enum Coursable {
	quiz = 'quiz',
	file = 'file',
}

export type CoursableData = Publishable & {
	courseId: string | null
}

export type CourseSectionItem =
	| {
			id: string
			type: Coursable.quiz
			quizMode: QuizModes
	  }
	| {
			id: string
			type: Coursable.file
			fileType: FileType
	  }

export type CourseSection = {
	label: string
	items: CourseSectionItem[]
}

export enum QuizMeta {
	games = 'games',
	tests = 'tests',
	total = 'total',
}

export enum CourseMeta {
	purchases = 'purchases',
	total = 'total',
}

export type QuizAccess = {
	requests: string[]
	members: string[]
}

export type CoursableAccess = {
	access?:
		| {
				organizationId: string
				classId: string
				lessonId: string
		  }
		| {
				courseId: string
		  }
		| {
				testId: string
		  }
		| {
				gameId: string
		  }
		| Record<string, any>
}

export enum QuizModes {
	practice = 'practice',
	tests = 'tests',
	games = 'games',
	flashcards = 'flashcards',
	assessments = 'assessments',
}

export type ExtendedCourseSectionItem =
	| {
			id: string
			type: Coursable.quiz
			quizMode: QuizModes
			quiz: QuizEntity
			icon: IconName
			title: string
			info: string
	  }
	| {
			id: string
			type: Coursable.file
			fileType: FileType
			file: FileEntity
			icon: IconName
			title: string
			info: string
	  }

export type ExtendedCourseSections = (Omit<CourseSection, 'items'> & { items: ExtendedCourseSectionItem[] })[]
