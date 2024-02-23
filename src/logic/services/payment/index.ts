import PurchasesApi from './PurchasesApi'
import WalletsApi from './WalletsApi'

export const PaymentApi = {
	purchase: new PurchasesApi(),
	wallet: new WalletsApi(),
}
