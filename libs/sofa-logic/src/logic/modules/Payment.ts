import { capitalize } from 'vue'
import { Logic } from '..'
import { $api } from '../../services'
import { Conditions, QueryParams } from '../types/common'
import { Paginated } from '../types/domains/common'
import {
	CommercialBanks,
	PaymentMethod,
	Plan,
	Purchase,
	Transaction,
	Wallet,
} from '../types/domains/payment'
import {
	FundWalletInput,
	MakePurchaseInput,
	UpdateAccountNumberInput,
	WithdrawalFromWalletInput,
} from './../types/forms/payment'
import Common from './Common'

export default class Payment extends Common {
	constructor() {
		super()
	}

	public PaymentMethods: Paginated<PaymentMethod> | undefined
	public PaymentMethod: PaymentMethod | undefined
	public UserWallet: Wallet | undefined
	public AllPlans: Paginated<Plan> | undefined
	public AllTransactions: Paginated<Transaction> | undefined
	public PurchasedItems: string[]
	public AllCommercialBanks: CommercialBanks[] | undefined

	public MakePurchaseForm: MakePurchaseInput | undefined
	public FundWalletForm: FundWalletInput | undefined
	public UpdateAccountForm: UpdateAccountNumberInput | undefined
	public verifyAccountNumberForm: UpdateAccountNumberInput | undefined
	public WithdrawalFromWalletForm: WithdrawalFromWalletInput | undefined

	public initialPayment = (amount = 0, type = 'newCard') => {
		Logic.Common.showLoading()
		$api.payment.transaction
			.post(null, { amount, data: { type } })
			.then((response) => {
				Logic.Common.hideLoading()
				const transId = response.data.id
				$api.payment.transaction.getFlutterwaveKey().then((response) => {
					const publicToken = response.data.publicKey
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
							email: Logic.Common.AuthUser.email,
							phone_number: `${Logic.Common.AuthUser.phone?.code}${Logic.Common.AuthUser.phone?.number}`,
							name: Logic.Common.AuthUser.allNames.full,
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
										const userQuery = {
											where: [
												{
													field: 'userId',
													condition: Conditions.eq,
													value: Logic.Common.AuthUser?.id,
												},
											],
										}
										Logic.Payment.GetUserWallet()
										Logic.Payment.GetTransactions(userQuery)
										Logic.Payment.GetPaymentMethods(userQuery)
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
			})
			.catch((error) => {
				Logic.Common.hideLoading()
				Logic.Common.showAlert({
					message: capitalize(error.response.data[0]?.message),
					type: 'error',
				})
			})
	}

	public GetUserWallet = () => {
		return $api.payment.wallet.getUserWallet().then((response) => {
			this.UserWallet = response.data
			return this.UserWallet
		})
	}

	public GetCommercialBanks = () => {
		return $api.payment.wallet.getCommercialBanks().then((response) => {
			this.AllCommercialBanks = response.data
		})
	}

	public GetPlans = (filter: QueryParams) => {
		return $api.payment.plan.fetch(filter).then((response) => {
			this.AllPlans = response.data
		})
	}

	public GetTransactions = (filter: QueryParams, append = false) => {
		return $api.payment.transaction.fetch(filter).then((response) => {
			if (append) {
				if (this.AllTransactions) {
					response.data.results.unshift(...this.AllTransactions.results)
					this.AllTransactions = response.data
				} else {
					this.AllTransactions = response.data
				}
			} else {
				this.AllTransactions = response.data
			}
		})
	}

	public GetPaymentMethods = (filter: QueryParams) => {
		return $api.payment.paymentMethod.fetch(filter).then((response) => {
			this.PaymentMethods = response.data
		})
	}

	public GetPaymentMethod = (id: string) => {
		return $api.payment.paymentMethod.get(id).then((response) => {
			this.PaymentMethod = response.data
		})
	}

	public async GetMyPurchases (filters: QueryParams) {
		return $api.payment.purchase.fetch(filters)
			.then((response) => response.data as Paginated<Purchase>)
	}

	public GetUserPurchases = (fetchItems: boolean) => {
		return new Promise((resolve) => {
			$api.payment.purchase
				.fetch({
					where: [
						{
							field: 'user.id',
							value: Logic.Common.AuthUser?.id,
							condition: Conditions.eq,
						},
					],
				})
				.then((response) => {
					const purchases: Paginated<Purchase> = response.data

					const allItems = []

					purchases.results.forEach((item) => {
						allItems.push(item.data.id)
					})

					this.PurchasedItems = allItems

					if (fetchItems) {
						$api.study.course
							.fetch({
								where: [
									{
										field: 'id',
										value: allItems,
										condition: Conditions.in,
									},
								],
							})
							.then((response) => {
								Logic.Study.PurchasedCourses = response.data
								resolve('')
							})
					} else {
						resolve('')
					}
				})
				.catch((error) => {
					throw error
				})
		})
	}

	public FundWallet = () => {
		if (this.FundWalletForm) {
			Logic.Common.showLoading()
			return $api.payment.wallet
				.fundWallet(this.FundWalletForm)
				.then((response) => {
					Logic.Payment.GetUserWallet()
					Logic.Payment.GetTransactions({
						where: [
							{
								field: 'userId',
								condition: Conditions.eq,
								value: Logic.Common.AuthUser?.id,
							},
						],
					})
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
					Logic.Payment.GetUserWallet()
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
					Logic.Payment.GetUserWallet()
					Logic.Payment.GetTransactions({
						where: [
							{
								field: 'userId',
								condition: Conditions.eq,
								value: Logic.Common.AuthUser?.id,
							},
						],
					})
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
				Logic.Payment.GetUserWallet()
				Logic.Common.hideLoading()
				return response.data
			})
			.catch((error) => {
				Logic.Common.hideLoading()
				Logic.Common.showError(capitalize(error.response.data[0]?.message))
			})
	}

	public ToggleSubscriptionRenew = (renew: boolean) => {
		return $api.payment.wallet
			.toggleSubscriptionRenew(renew)
			.then((response) => {
				Logic.Payment.GetUserWallet()
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

	public MakeMethodPrimary = (id: string) => {
		Logic.Common.showLoading()
		return $api.payment.paymentMethod
			.makePrimaryPaymentMethod(id)
			.then((response) => {
				this.GetPaymentMethods({
					where: [
						{
							field: 'userId',
							condition: Conditions.eq,
							value: Logic.Common.AuthUser?.id,
						},
					],
				})
				this.PaymentMethod = response.data
				Logic.Common.hideLoading()
				Logic.Common.showAlert({
					message: 'Payment method set as primary',
					type: 'success',
				})
			})
			.catch((error) => {
				Logic.Common.hideLoading()
				Logic.Common.showError(capitalize(error.response.data[0]?.message))
			})
	}

	public DeleteMethod = (id: string) => {
		Logic.Common.showLoading()
		return $api.payment.paymentMethod
			.delete(id)
			.then(() => {
				this.GetPaymentMethods({
					where: [
						{
							field: 'userId',
							condition: Conditions.eq,
							value: Logic.Common.AuthUser?.id,
						},
					],
				})
				Logic.Common.hideLoading()
				Logic.Common.showAlert({
					message: 'Payment method deleted',
					type: 'success',
				})
			})
			.catch((error) => {
				Logic.Common.hideLoading()
				Logic.Common.showError(capitalize(error.response.data[0]?.message))
			})
	}
}
