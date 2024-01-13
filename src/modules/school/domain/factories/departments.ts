import { BaseFactory } from '@modules/core'
import { v } from 'valleyed'
import { DepartmentToModel } from '../../data/models/departments'
import { DepartmentEntity } from '../entities/departments'

export class DepartmentFactory extends BaseFactory<DepartmentEntity, DepartmentToModel, DepartmentToModel> {
	readonly rules = {
		title: v.string().min(1),
		facultyId: v.string().min(1),
		tagId: v.string().min(1),
	}

	reserved = []

	constructor() {
		super({ title: '', facultyId: '' })
	}

	get title() {
		return this.values.title
	}

	set title(value: string) {
		this.set('title', value.toLowerCase())
	}

	get facultyId() {
		return this.values.facultyId
	}

	set facultyId(value: string) {
		this.set('facultyId', value)
	}

	loadEntity = (entity: DepartmentEntity) => {
		this.title = entity.title
		this.facultyId = entity.facultyId
	}

	model = async () => {
		const { title, facultyId } = this.validValues
		return { title, facultyId }
	}
}
