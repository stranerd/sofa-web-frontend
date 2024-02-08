import { AccountDetails, Currencies, Subscription, SubscriptionModel } from '../../domain/types'
export interface WalletFromModel {
	id: string
	userId: string
	balance: { amount: number; currency: Currencies }
	accounts: AccountDetails[]
	subscription: SubscriptionModel
	subscriptions: Subscription[]
	createdAt: number
	updatedAt: number
}
