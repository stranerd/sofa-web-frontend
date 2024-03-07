import { TransactionFromModel } from '../../data/models/transactions'
import { TransactionStatus } from '../types'
import { BaseEntity } from '@modules/core'

export class TransactionEntity extends BaseEntity<TransactionFromModel> {
	constructor(data: TransactionFromModel) {
		super(data)
	}

	get color() {
		if (this.status === TransactionStatus.failed) return 'text-primaryRed'
		if (this.status === TransactionStatus.initialized || this.status === TransactionStatus.fulfilled) return 'text-primaryOrange'
		return this.amount >= 0 ? 'text-primaryGreen' : 'text-primaryRed'
	}
}
