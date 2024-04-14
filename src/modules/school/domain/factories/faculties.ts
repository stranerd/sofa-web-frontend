import { v } from 'valleyed'
import { FacultyToModel } from '../../data/models/faculties'
import { FacultyEntity } from '../entities/faculties'
import { BaseFactory } from '@modules/core'

export class FacultyFactory extends BaseFactory<FacultyEntity, FacultyToModel, FacultyToModel> {
	readonly rules = {
		title: v.string().min(1).lower(),
		institutionId: v.string().min(1),
	}

	reserved = []

	constructor() {
		super({ title: '', institutionId: '' })
	}

	load = (entity: FacultyEntity) => {
		this.title = entity.title
		this.institutionId = entity.institutionId
	}

	model = () => {
		const { title, institutionId } = this.validValues
		return { title, institutionId }
	}
}
