import { v } from 'valleyed'
import { CourseToModel } from '../../data/models/courses'
import { CourseEntity } from '../entities/courses'
import { BaseFactory } from '@modules/core'

export class CourseFactory extends BaseFactory<CourseEntity, CourseToModel, CourseToModel> {
	readonly rules = {
		title: v.string().min(1).lower(),
		institutionId: v.string().min(1),
		departmentId: v.string().min(1).nullable(),
	}

	reserved = []

	constructor() {
		super({ title: '', institutionId: '', departmentId: null })
	}

	load = (entity: CourseEntity) => {
		this.title = entity.title
		this.institutionId = entity.institutionId
		this.departmentId = entity.departmentId
	}

	model = async () => {
		const { title, institutionId, departmentId } = this.validValues
		return { title, institutionId, departmentId }
	}
}
