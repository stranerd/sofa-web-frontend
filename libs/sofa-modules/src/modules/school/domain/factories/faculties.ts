import { BaseFactory } from '@modules/core'
import { v } from 'valleyed'
import { FacultyToModel } from '../../data/models/faculties'
import { FacultyEntity } from '../entities/faculties'

export class FacultyFactory extends BaseFactory<FacultyEntity, FacultyToModel, FacultyToModel> {
	readonly rules = {
		title: v.string().min(1),
		institutionId: v.string().min(1),
	}

	reserved = []

	constructor() {
		super({ title: '', institutionId: '' })
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

	loadEntity = (entity: FacultyEntity) => {
		this.title = entity.title
		this.institutionId = entity.institutionId
	}

	toModel = async () => {
		if (this.valid) {
			const { title, institutionId } = this.validValues
			return { title, institutionId }
		} else {
			throw new Error('Validation errors')
		}
	}
}
