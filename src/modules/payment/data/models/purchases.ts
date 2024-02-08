import { PurchaseData, Saleable } from '@modules/payment/domain/types'
export interface PurchaseFromModel extends PurchaseToModel {
	id: string
	userId: string
	price: Saleable['price']
	createdAt: number
	updatedAt: number
}
export interface PurchaseToModel {
	data: PurchaseData
}
