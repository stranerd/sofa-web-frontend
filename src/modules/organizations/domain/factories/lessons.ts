import { v } from 'valleyed'
import { ClassLesson, LessonToModel } from '../types'
import { BaseFactory } from '@modules/core'

export class LessonFactory extends BaseFactory<ClassLesson, LessonToModel, LessonToModel> {
	readonly rules = {
		title: v.string().min(1),
		teachers: v.array(v.string().min(1)).min(1),
	}

	constructor() {
		super({ title: '', teachers: [] })
	}

	model = () => {
		const { title, teachers } = this.validValues
		return { title, teachers }
	}

	load = (entity: ClassLesson) => {
		this.entityId = entity.id
		this.title = entity.title
		this.teachers = entity.users.teachers
	}
}
