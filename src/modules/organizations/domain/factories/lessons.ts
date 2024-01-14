import { BaseFactory } from '@modules/core'
import { v } from 'valleyed'
import { ClassLesson, LessonToModel } from '../types'

export class LessonFactory extends BaseFactory<ClassLesson, LessonToModel, LessonToModel> {
	readonly rules = {
		title: v.string().min(1),
		teachers: v.array(v.string()),
	}

	constructor() {
		super({ title: '', teachers: [] })
	}

	get title() {
		return this.values.title
	}

	set title(value: string) {
		this.set('title', value)
	}

	model = async () => {
		const { title, teachers } = this.validValues
		return { title, teachers }
	}

	loadEntity = (entity: ClassLesson) => {
		this.entityId = entity.id
		this.title = entity.title
	}
}
