import { v } from 'valleyed'
import { ClassLesson, LessonToModel } from '../types'
import { BaseFactory } from '@modules/core'

type Keys = { title: string; teacher: string }

export class LessonFactory extends BaseFactory<ClassLesson, LessonToModel, Keys> {
	readonly rules = {
		title: v.string().min(1),
		teacher: v.string().min(1),
	}

	constructor() {
		super({ title: '', teacher: '' })
	}

	get title() {
		return this.values.title
	}

	set title(value: string) {
		this.set('title', value)
	}

	get teacher() {
		return this.values.teacher
	}

	set teacher(value: string) {
		this.set('teacher', value)
	}

	model = async () => {
		const { title, teacher } = this.validValues
		return { title, teachers: [teacher] }
	}

	loadEntity = (entity: ClassLesson) => {
		this.entityId = entity.id
		this.title = entity.title
	}
}
