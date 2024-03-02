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
		return this.__type.startsWith('QuizEntity')
	}

	isCourse(): this is CourseEntity {
		return this.__type.startsWith('CourseEntity')
	}

	isFile(): this is FileEntity {
		return this.__type.startsWith('FileEntity')
	}
}

type PublishableConstructorArgs = Publishable & {
	id: string
	createdAt: number
	updatedAt: number
}

export class CoursableEntity<
		T extends PublishableConstructorArgs & { courseId: string | null } = PublishableConstructorArgs & { courseId: string | null },
	>
	extends PublishableEntity<T>
	implements CoursableData
{
	constructor(data: T) {
		super(data)
	}
}
