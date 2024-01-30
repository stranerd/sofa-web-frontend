import { v } from 'valleyed'
import { CourseToModel } from '../../data/models/courses'
import { CourseEntity } from '../entities/courses'
import { BaseFactory } from '@modules/core'

export class CourseFactory extends BaseFactory<CourseEntity, CourseToModel, CourseToModel> {
	readonly rules = {
		title: v.string().min(1),
		institutionId: v.string().min(1),
		departmentId: v.string().min(1).nullable(),
	}

	reserved = []

	constructor() {
		super({ title: '', institutionId: '', departmentId: null })
	}

	get title() {
		return this.values.title
	}

	set title(value: string) {
		this.set('title', value.toLowerCase())
	}

	get institutionId() {
		return this.values.institutionId
	}

	set institutionId(value: string) {
		this.set('institutionId', value)
	}

	get departmentId() {
		return this.values.departmentId
	}

	set departmentId(value: string | null) {
		this.set('departmentId', value)
	}

	loadEntity = (entity: CourseEntity) => {
		this.title = entity.title
		this.institutionId = entity.institutionId
		this.departmentId = entity.departmentId
	}

	model = async () => {
		const { title, institutionId, departmentId } = this.validValues
		return { title, institutionId, departmentId }
	}
}
