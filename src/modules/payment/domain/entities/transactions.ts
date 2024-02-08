import { Currencies, TransactionData, TransactionStatus } from '../types'
import { BaseEntity } from '@modules/core'
import { TransactionFromModel } from '@modules/payment/data/models/transactions'

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
}
