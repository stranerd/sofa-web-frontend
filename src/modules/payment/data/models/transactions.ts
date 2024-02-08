import { Currencies, TransactionStatus, TransactionData } from '@modules/payment/domain/types'

export interface TransactionFromModel extends TransactionToModel {
	id: string
	userId: string
	email: string
	title: string
	amount: number
	currency: Currencies
	status: TransactionStatus
	createdAt: number
	updatedAt: number
}

export interface TransactionToModel {
	data: TransactionData
}
