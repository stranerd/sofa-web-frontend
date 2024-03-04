import { divideByZero } from 'valleyed'
import { PlanFromModel } from '../../data/models/plans'
import { BaseEntity } from '@modules/core'

export class PlanEntity extends BaseEntity<PlanFromModel> {
	constructor(data: PlanFromModel) {
		super(data)
	}

	get pricePerDay() {
		return divideByZero(this.amount, this.lengthInDays)
	}

	get intervalInWord() {
		return this.interval === 'monthly' ? 'month' : 'week'
	}
}
