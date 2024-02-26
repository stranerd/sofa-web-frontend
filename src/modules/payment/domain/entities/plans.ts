import { PlanFromModel } from '../../data/models/plans'
import { BaseEntity } from '@modules/core'

export class PlanEntity extends BaseEntity<PlanFromModel> {
	constructor(data: PlanFromModel) {
		super(data)
	}
}
