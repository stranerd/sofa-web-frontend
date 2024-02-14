import { v } from 'valleyed'
import { ReportToModel } from '../../data/models/reports'
import { ReportEntity } from '../entities/reports'
import { BaseFactory } from '@modules/core'

export class ReportFactory extends BaseFactory<ReportEntity, Omit<ReportToModel, 'entity'>, Omit<ReportToModel, 'entity'>> {
	readonly rules = {
		message: v.string().min(1),
	}

	reserved = []

	constructor() {
		super({ message: '' })
	}

	loadEntity = (entity: ReportEntity) => {
		this.message = entity.message
	}

	model = async () => {
		const { message } = this.validValues
		return { message }
	}
}
