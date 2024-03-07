export * from './purchases'
export * from './subscriptions'
import { PurchaseToModel } from '../../data/models/purchases'
import { SelectedPaymentMethod } from './purchases'
import { Subscription } from './subscriptions'

export enum Currencies {
	NGN = 'NGN',
}

export enum TransactionStatus {
	initialized = 'initialized',
	fulfilled = 'fulfilled',
	failed = 'failed',
	settled = 'settled',
}

export enum TransactionType {
	newCard = 'newCard',
	subscription = 'subscription',
	genericSubscription = 'genericSubscription',
	classSubscriptionPayment = 'classSubscriptionPayment',
	purchase = 'purchase',
	purchased = 'purchased',
	sent = 'sent',
	received = 'received',
	fundWallet = 'fundWallet',
	withdrawal = 'withdrawal',
	withdrawalRefund = 'withdrawalRefund',
}

export type TransactionData =
	| {
			type: TransactionType.newCard
	  }
	| {
			type: TransactionType.subscription
			subscriptionId: string
			multiplier: number
	  }
	| {
			type: TransactionType.genericSubscription
			data: Subscription['data']
	  }
	| {
			type: TransactionType.classSubscriptionPayment
			classId: string
			organizationId: string
			userId: string
			serviceCharge: number
	  }
	| {
			type: TransactionType.purchase
			purchase: PurchaseToModel
	  }
	| {
			type: TransactionType.purchased
			purchaseId: string
			userId: string
			serviceCharge: number
			purchasedType: PurchaseToModel['type']
			purchasedId: PurchaseToModel['id']
	  }
	| {
			type: TransactionType.sent
			note: string
			to: string
	  }
	| {
			type: TransactionType.received
			note: string
			from: string
	  }
	| {
			type: TransactionType.fundWallet
	  }
	| {
			type: TransactionType.withdrawal
			withdrawalId: string
	  }
	| {
			type: TransactionType.withdrawalRefund
			withdrawalId: string
	  }

export enum MethodType {
	card = 'card',
}

export type MethodData = {
	type: MethodType.card
	last4Digits: string
	country: string
	cardType: string
	expiredAt: number
	expired: boolean
}

export type Interval = 'monthly' | 'weekly'

export type TransferData = {
	from: string
	to: string
	fromEmail: string
	toEmail: string
	amount: number
	note: string
}

export type WithdrawData = {
	amount: number
	account: Omit<AccountDetails, 'bankName' | 'ownerName'>
}

export enum CurrencyCountries {
	NG = 'NG',
}

export type AccountDetails = {
	country: CurrencyCountries
	bankNumber: string
	bankCode: string
	bankName: string
	ownerName: string
}

export enum WithdrawalStatus {
	created = 'created',
	inProgress = 'inProgress',
	failed = 'failed',
	completed = 'completed',
	refunded = 'refunded',
}

export type BankData = {
	id: number
	code: string
	name: string
}

export type FundDetails = {
	amount: number
	methodId: Exclude<SelectedPaymentMethod, true>
}

export type FlutterwaveSecrets = {
	publicKey: string
}
