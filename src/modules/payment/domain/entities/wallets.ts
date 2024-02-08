import { AccountDetails, Currencies, Subscription, SubscriptionModel } from '../types'
import { BaseEntity } from '@modules/core'
import { WalletFromModel } from '@modules/payment/data/models/wallets'

export class WalletEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly balance: { amount: number; currency: Currencies }
	public readonly accounts: AccountDetails[]
	public readonly subscription: SubscriptionModel
	public readonly subscriptions: Subscription[]
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, userId, balance, accounts, subscription, subscriptions, createdAt, updatedAt }: WalletFromModel) {
		super()
		this.id = id
		this.userId = userId
		this.balance = balance
		this.accounts = accounts
		this.subscription = subscription
		this.subscriptions = subscriptions
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
