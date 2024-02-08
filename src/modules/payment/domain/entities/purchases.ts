import { PurchaseData, Saleable } from '../types'
import { BaseEntity } from '@modules/core'
import { PurchaseFromModel } from '@modules/payment/data/models/purchases'

export class PurchaseEntity extends BaseEntity {
	public readonly id: string
	public readonly price: Saleable['price']
	public readonly userId: string
	public readonly data: PurchaseData
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, userId, price, data, createdAt, updatedAt }: PurchaseFromModel) {
		super()
		this.id = id
		this.userId = userId
		this.price = price
		this.data = data
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
