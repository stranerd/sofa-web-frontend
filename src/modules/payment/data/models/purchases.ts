import { PurchaseData, Saleable, SelectedPaymentMethod } from '../../domain/types'
export interface PurchaseFromModel {
	id: string
	userId: string
	price: Saleable['price']
	data: PurchaseData
	createdAt: number
	updatedAt: number
}

export interface PurchaseToModel {
	type: PurchaseData['type']
	id: PurchaseData['id']
	methodId: SelectedPaymentMethod
}
