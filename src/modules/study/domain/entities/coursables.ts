import { CoursableData, DraftStatus, Publishable } from '../types'
import type { CourseEntity } from './courses'
import type { FileEntity } from './files'
import type { QuizEntity } from './quizzes'
import { BaseEntity } from '@modules/core'

export class PublishableEntity<T extends PublishableConstructorArgs = PublishableConstructorArgs>
	extends BaseEntity<T>
	implements Publishable
{
	constructor(data: T) {
		super(data)
	}

	get picture() {
		return this.photo?.link ?? '/images/default.svg'
	}

	get isPublished() {
		return this.status === DraftStatus.published
	}

	get isDraft() {
		return this.status === DraftStatus.draft
	}

	canEdit(userId: string): boolean {
		if (this.user.id === userId) return true
		if (this.isQuiz()) return this.access.members.includes(userId)
		else return false
	}

	isQuiz(): this is QuizEntity {
		return '__type' in this && this.__type === 'QuizEntity'
	}

	isCourse(): this is CourseEntity {
		return '__type' in this && this.__type === 'CourseEntity'
	}

	isFile(): this is FileEntity {
		return '__type' in this && this.__type === 'FileEntity'
	}
}

type PublishableConstructorArgs = Publishable & {
	id: string
	createdAt: number
	updatedAt: number
}

export class CoursableEntity<
		T extends PublishableConstructorArgs & { courseIds: string[] } = PublishableConstructorArgs & { courseIds: string[] },
	>
	extends PublishableEntity<T>
	implements CoursableData
{
	constructor(data: T) {
		super(data)
	}
}
