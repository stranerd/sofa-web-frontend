import { Currencies, Interval, PlanData } from '../types'
import { BaseEntity } from '@modules/core'
import { PlanFromModel } from '@modules/payment/data/models/plans'
import { UserType } from '@modules/users'

export class PlanEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly interval: Interval
	public readonly active: boolean
	public readonly amount: number
	public readonly currency: Currencies
	public readonly data: PlanData
	public readonly usersFor: UserType[]
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, amount, currency, title, interval, active, data, usersFor, createdAt, updatedAt }: PlanFromModel) {
		super()
		this.id = id
		this.title = title
		this.interval = interval
		this.active = active
		this.amount = amount
		this.currency = currency
		this.data = data
		this.usersFor = usersFor
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
