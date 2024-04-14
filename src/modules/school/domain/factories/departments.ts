import { v } from 'valleyed'
import { DepartmentToModel } from '../../data/models/departments'
import { DepartmentEntity } from '../entities/departments'
import { BaseFactory } from '@modules/core'

export class DepartmentFactory extends BaseFactory<DepartmentEntity, DepartmentToModel, DepartmentToModel> {
	readonly rules = {
		title: v.string().min(1).lower(),
		facultyId: v.string().min(1),
		tagId: v.string().min(1),
	}

	reserved = []

	constructor() {
		super({ title: '', facultyId: '' })
	}

	load = (entity: DepartmentEntity) => {
		this.title = entity.title
		this.facultyId = entity.facultyId
	}

	model = async () => {
		const { title, facultyId } = this.validValues
		return { title, facultyId }
	}
}
