import { TransactionFromModel } from '../../data/models/transactions'
import { Currencies, TransactionData, TransactionStatus, TransactionType } from '../types'
import { BaseEntity } from '@modules/core'

export class TransactionEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly email: string
	public readonly title: string
	public readonly amount: number
	public readonly currency: Currencies
	public readonly status: TransactionStatus
	public readonly data: TransactionData
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, userId, email, status, data, title, amount, currency, createdAt, updatedAt }: TransactionFromModel) {
		super()
		this.id = id
		this.userId = userId
		this.email = email
		this.title = title
		this.amount = amount
		this.currency = currency
		this.status = status
		this.data = data
		this.createdAt = createdAt
		this.updatedAt = updatedAt
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
