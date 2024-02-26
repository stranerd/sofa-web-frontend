import { PurchaseFromModel } from '../../data/models/purchases'
import { BaseEntity } from '@modules/core'

export class PurchaseEntity extends BaseEntity<PurchaseFromModel> {
	constructor(data: PurchaseFromModel) {
		super(data)
	}
}
