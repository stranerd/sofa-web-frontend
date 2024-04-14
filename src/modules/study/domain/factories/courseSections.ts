import { v } from 'valleyed'
import type { FileEntity } from '../entities/files'
import type { QuizEntity } from '../entities/quizzes'
import { Coursable, CourseSection, FileType } from '../types'
import { PlayTypes } from '@modules/plays'
import { BaseFactory, asArray } from '@modules/core'

class _SectionFactory extends BaseFactory<CourseSection, CourseSection, CourseSection> {
	readonly rules = {
		label: v.string().min(1),
		items: v.array(
			v.discriminate((d) => d.type, {
				[Coursable.quiz]: v.object({
					id: v.string().min(1),
					type: v.is(Coursable.quiz as const),
					quizMode: v.in(Object.values(PlayTypes)),
				}),
				[Coursable.file]: v.object({
					id: v.string().min(1),
					type: v.is(Coursable.file as const),
					fileType: v.in(Object.values(FileType)),
				}),
			}),
		),
	}

	constructor() {
		super({ label: 'Untitled', items: [] })
	}

	addQuiz(quiz: QuizEntity, mode: PlayTypes) {
		this.items = [...this.items, { type: Coursable.quiz, id: quiz.id, quizMode: mode }]
	}

	addFile(file: FileEntity) {
		this.items = [...this.items, { type: Coursable.file, id: file.id, fileType: file.type }]
	}

	removeItem(index: number) {
		this.items = this.items.filter((_, i) => i !== index)
	}

	model = async () => {
		const { label, items } = this.validValues
		return { label, items }
	}

	load = (entity: CourseSection) => {
		this.label = entity.label
		this.items = entity.items
	}
}
export class CourseSectionsFactory extends asArray(_SectionFactory) {}
