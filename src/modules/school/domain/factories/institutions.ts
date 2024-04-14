import { v } from 'valleyed'
import { InstitutionToModel } from '../../data/models/institutions'
import { InstitutionEntity } from '../entities/institutions'
import { BaseFactory } from '@modules/core'

export class InstitutionFactory extends BaseFactory<InstitutionEntity, InstitutionToModel, InstitutionToModel> {
	readonly rules = {
		title: v.string().min(1).lower(),
		isGateway: v.boolean(),
	}

	reserved = []

	constructor() {
		super({ title: '', isGateway: false })
	}

	load = (entity: InstitutionEntity) => {
		this.title = entity.title
		this.isGateway = entity.isGateway
	}

	model = () => {
		const { title, isGateway } = this.validValues
		return { title, isGateway }
	}
}
