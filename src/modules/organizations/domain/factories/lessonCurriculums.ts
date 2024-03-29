import { v } from 'valleyed'
import { ScheduleEntity } from '../entities/schedules'
import { ClassLessonCurriculumSection, ClassLessonable } from '../types'
import { BaseFactory } from '@modules/core'
import { asArray } from '@modules/core/domain/factories/arrays'
import { FileEntity, FileType, QuizEntity } from '@modules/study'
import { PlayTypes } from '@modules/plays'

class _CurriculumFactory extends BaseFactory<ClassLessonCurriculumSection, ClassLessonCurriculumSection, ClassLessonCurriculumSection> {
	readonly rules = {
		label: v.string().min(1),
		items: v.array(
			v.discriminate((d) => d.type, {
				[ClassLessonable.quiz]: v.object({
					id: v.string().min(1),
					type: v.is(ClassLessonable.quiz as const),
					quizMode: v.in(Object.values(PlayTypes)),
				}),
				[ClassLessonable.file]: v.object({
					id: v.string().min(1),
					type: v.is(ClassLessonable.file as const),
					fileType: v.in(Object.values(FileType)),
				}),
				[ClassLessonable.schedule]: v.object({
					id: v.string().min(1),
					type: v.is(ClassLessonable.schedule as const),
				}),
			}),
		),
	}

	constructor() {
		super({ label: 'Untitled', items: [] })
	}

	addSchedule(schedule: ScheduleEntity) {
		this.items = [...this.items, { type: ClassLessonable.schedule, id: schedule.id }]
	}

	addQuiz(quiz: QuizEntity, mode: PlayTypes) {
		this.items = [...this.items, { type: ClassLessonable.quiz, id: quiz.id, quizMode: mode }]
	}

	addFile(file: FileEntity) {
		this.items = [...this.items, { type: ClassLessonable.file, id: file.id, fileType: file.type }]
	}

	removeItem(index: number) {
		this.items = this.items.filter((_, i) => i !== index)
	}

	model = async () => {
		const { label, items } = this.validValues
		return { label, items }
	}

	loadEntity = (entity: ClassLessonCurriculumSection) => {
		this.label = entity.label
		this.items = entity.items
	}
}
export class LessonCurriculumFactory extends asArray(_CurriculumFactory) {}
