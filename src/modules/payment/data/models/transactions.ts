import { Currencies, TransactionStatus, TransactionData } from '@modules/payment/domain/types'

export interface TransactionToModel {
	id: string
	userId: string
	email: string
	title: string
	amount: number
	currency: Currencies
	status: TransactionStatus
	data: TransactionData
}
