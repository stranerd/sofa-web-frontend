import { capitalize } from 'vue'
import { Logic } from '..'
import { $api } from '../../services'
import { CommercialBanks } from '../types/domains/payment'
import { FundWalletInput, MakePurchaseInput, UpdateAccountNumberInput, WithdrawalFromWalletInput } from '../types/forms/payment'
import Common from './Common'

export default class Payment extends Common {
	constructor() {
		super()
	}

	public AllCommercialBanks: CommercialBanks[] | undefined

	public MakePurchaseForm: MakePurchaseInput | undefined
	public FundWalletForm: FundWalletInput | undefined
	public UpdateAccountForm: UpdateAccountNumberInput | undefined
	public verifyAccountNumberForm: UpdateAccountNumberInput | undefined
	public WithdrawalFromWalletForm: WithdrawalFromWalletInput | undefined

	public initialPayment = (amount = 0, type = 'newCard') => {
		Logic.Common.showLoading()
		return $api.payment.transaction
			.post(null, { amount, data: { type } })
			.then(async (response) => {
				Logic.Common.hideLoading()
				const transId = response.data.id
				const res = await $api.payment.transaction.getFlutterwaveKey()
				const publicToken = res.data.publicKey
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const paymentModal = FlutterwaveCheckout({
					public_key: publicToken,
					tx_ref: transId,
					amount: amount ? amount : 10,
					currency: 'NGN',
					payment_options: 'card',
					meta: {
						user_id: Logic.Common.AuthUser?.id,
					},
					customer: {
						email: Logic.Common.AuthUser?.email,
						phone_number: `${Logic.Common.AuthUser?.phone?.code}${Logic.Common.AuthUser?.phone?.number}`,
						name: Logic.Common.AuthUser?.allNames.full,
					},
					onclose: function () {
						//
					},
					callback: () => {
						setTimeout(() => {
							$api.payment.transaction
								.fulfillTransaction(transId)
								.then(() => {
									paymentModal.close()
									Logic.Common.showAlert({
										message: 'Transaction completed successfully!',
										type: 'success',
									})
								})
								.catch((error) => {
									Logic.Common.showAlert({
										message: capitalize(error.response.data[0]?.message),
										type: 'error',
									})
								})
						}, 3000)
					},
				})
			})
			.catch((error) => {
				Logic.Common.hideLoading()
				Logic.Common.showAlert({
					message: capitalize(error.response.data[0]?.message),
					type: 'error',
				})
				return false
			})
	}

	public GetCommercialBanks = () =>
		$api.payment.wallet.getCommercialBanks().then((response) => {
			this.AllCommercialBanks = response.data
		})

	public FundWallet = () => {
		if (this.FundWalletForm) {
			Logic.Common.showLoading()
			return $api.payment.wallet
				.fundWallet(this.FundWalletForm)
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

	public UpdateAccountNumber = () => {
		if (this.UpdateAccountForm) {
			Logic.Common.showLoading()
			return $api.payment.wallet
				.updateAccountNumber(this.UpdateAccountForm)
				.then((response) => {
					Logic.Common.hideLoading()
					return response.data
				})
				.catch(() => {
					Logic.Common.hideLoading()
				})
		}
	}

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

	public MakePurchase = () => {
		if (this.MakePurchaseForm) {
			Logic.Common.showLoading()
			return $api.payment.purchase
				.post(null, this.MakePurchaseForm)
				.then((response) => {
					Logic.Common.hideLoading()
					return response.data
				})
				.catch(() => {
					Logic.Common.hideLoading()
				})
		}
	}

	public SubscribeToPlan = (planId: string) => {
		Logic.Common.showLoading()
		return $api.payment.wallet
			.subscribeToPlan({
				planId: planId,
			})
			.then((response) => {
				Logic.Common.hideLoading()
				return response.data
			})
			.catch((error) => {
				Logic.Common.hideLoading()
				Logic.Common.showError(capitalize(error.response.data[0]?.message))
			})
	}

	public ToggleSubscriptionRenew = (renew: boolean) =>
		$api.payment.wallet
			.toggleSubscriptionRenew(renew)
			.then((response) => {
				Logic.Common.showAlert({
					message: 'Your subscription auto renewal has been updated',
					type: 'success',
				})
				return response.data
			})
			.catch((error) => {
				Logic.Common.showError(capitalize(error.response.data[0]?.message))
			})
}
