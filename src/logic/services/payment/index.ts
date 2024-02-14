import PurchasesApi from './PurchasesApi'
import TransactionsApi from './TransactionsApi'
import WalletsApi from './WalletsApi'

export const PaymentApi = {
	purchase: new PurchasesApi(),
	transaction: new TransactionsApi(),
	wallet: new WalletsApi(),
}
