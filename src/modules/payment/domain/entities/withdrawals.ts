import { WithdrawalFromModel } from '../../data/models/withdrawals'
import { BaseEntity } from '@modules/core'

export class WithdrawalEntity extends BaseEntity<WithdrawalFromModel> {
	constructor(data: WithdrawalFromModel) {
		super(data)
	}

	get chargedAmount() {
		return this.amount + this.fee
	}
}
