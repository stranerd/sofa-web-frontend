import { BaseFactory } from '@modules/core'
import { v } from 'valleyed'
import { InstitutionToModel } from '../../data/models/institutions'
import { InstitutionEntity } from '../entities/institutions'

export class InstitutionFactory extends BaseFactory<InstitutionEntity, InstitutionToModel, InstitutionToModel> {
	readonly rules = {
		title: v.string().min(1),
		isGateway: v.boolean()
	}

	reserved = []

	constructor () {
		super({ title: '', isGateway: false })
	}

	get title () {
		return this.values.title
	}

	set title (value: string) {
		this.set('title', value.toLowerCase())
	}

	get isGateway () {
		return this.values.isGateway
	}

	set isGateway (value: boolean) {
		this.set('isGateway', value)
	}

	loadEntity = (entity: InstitutionEntity) => {
		this.title = entity.title
		this.isGateway = entity.isGateway
	}

	toModel = async () => {
		if (this.valid) {
			const { title, isGateway } = this.validValues
			return { title, isGateway }
		} else {
			throw new Error('Validation errors')
		}
	}
}
