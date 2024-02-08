import { AccountDetails, Currencies, WithdrawalStatus } from '../types'
import { BaseEntity } from '@modules/core'

export class WithdrawalEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly email: string
	public readonly amount: number
	public readonly fee: number
	public readonly currency: Currencies
	public readonly status: WithdrawalStatus
	public readonly account: AccountDetails
	public readonly externalId: number | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({
		id,
		userId,
		email,
		amount,
		fee,
		currency,
		status,
		account,
		externalId,
		createdAt,
		updatedAt,
	}: WithdrawalConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.email = email
		this.amount = amount
		this.fee = fee
		this.currency = currency
		this.status = status
		this.account = account
		this.externalId = externalId
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	getChargedAmount() {
		return this.amount + this.fee
	}
}

type WithdrawalConstructorArgs = {
	id: string
	userId: string
	email: string
	amount: number
	fee: number
	currency: Currencies
	status: WithdrawalStatus
	account: AccountDetails
	externalId: number | null
	createdAt: number
	updatedAt: number
}
