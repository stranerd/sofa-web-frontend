import { PurchaseData, Saleable } from '@modules/payment/domain/types'
export interface PurchaseFromModel extends PurchaseToModel {
	id: string
	userId: string
	price: Saleable['price']
}
export interface PurchaseToModel {
	data: PurchaseData
}
