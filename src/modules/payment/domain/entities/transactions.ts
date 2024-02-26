import { TransactionFromModel } from '../../data/models/transactions'
import { TransactionStatus, TransactionType } from '../types'
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

	get label() {
		if (this.data.type === TransactionType.newCard) return 'New Payment Method'
		if (this.data.type === TransactionType.subscription) return 'Subscription'
		if (this.data.type === TransactionType.genericSubscription) return `${this.data.data.type} Subscription`
		if (this.data.type === TransactionType.purchase) return 'New Purchase'
		if (this.data.type === TransactionType.purchased) return 'Item Sold'
		if (this.data.type === TransactionType.sent) return 'Transfer sent'
		if (this.data.type === TransactionType.received) return 'Transfer received'
		if (this.data.type === TransactionType.fundWallet) return 'Wallet funding'
		if (this.data.type === TransactionType.withdrawal) return 'Withdrawal'
		if (this.data.type === TransactionType.withdrawalRefund) return 'Refund Failed Withdrawal'
		return this.title
	}
}
