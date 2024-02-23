import { Logic } from '..'
import { $api } from '../../services'
import { CommercialBanks } from '../types/domains/payment'
import { UpdateAccountNumberInput, WithdrawalFromWalletInput } from '../types/forms/payment'
import Common from './Common'

export default class Payment extends Common {
	constructor() {
		super()
	}

	public AllCommercialBanks: CommercialBanks[] | undefined

	public UpdateAccountForm: UpdateAccountNumberInput | undefined
	public verifyAccountNumberForm: UpdateAccountNumberInput | undefined
	public WithdrawalFromWalletForm: WithdrawalFromWalletInput | undefined

	public GetCommercialBanks = () =>
		$api.payment.wallet.getCommercialBanks().then((response) => {
			this.AllCommercialBanks = response.data
		})

	public VerifyAccountNumber = () => {
		if (this.verifyAccountNumberForm) {
			return $api.payment.wallet
				.verifyAccountNumber(this.verifyAccountNumberForm)
				.then((response) => {
					Logic.Common.hideLoading()
					return response.data
				})
				.catch((error) => {
					Logic.Common.hideLoading()
					throw error
				})
		}
	}

	public WithdrawFromWallet = () => {
		if (this.WithdrawalFromWalletForm) {
			Logic.Common.showLoading()
			return $api.payment.wallet
				.withdrawFromWallet(this.WithdrawalFromWalletForm)
				.then((response) => {
					Logic.Common.hideLoading()
					return response.data
				})
				.catch((error) => {
					Logic.Common.hideLoading()
					throw error
				})
		}
	}
}
