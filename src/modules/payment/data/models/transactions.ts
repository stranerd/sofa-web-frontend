import { Currencies, TransactionStatus, TransactionData } from '../../domain/types'

export interface TransactionFromModel extends Omit<TransactionToModel, 'data'> {
	id: string
	userId: string
	email: string
	title: string
	amount: number
	data: TransactionData
	currency: Currencies
	status: TransactionStatus
	createdAt: number
	updatedAt: number
}

export interface TransactionToModel {
	amount: number
	data: {
		type: TransactionData['type']
	}
}
