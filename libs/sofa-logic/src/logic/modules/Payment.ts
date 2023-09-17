import {
  MakePurchaseInput,
  FundWalletInput,
  UpdateAccountNumberInput,
} from './../types/forms/payment'
import { $api } from '../../services'
import Common from './Common'
import { Logic } from '..'
import {
  CommercialBanks,
  PaymentMethod,
  Plan,
  Purchase,
  Transaction,
  Wallet,
} from '../types/domains/payment'
import { Paginated } from '../types/domains/common'
import { Conditions, QueryParams } from '../types/common'

export default class Payment extends Common {
  constructor() {
    super()
  }

  public PaymentMethods: Paginated<PaymentMethod> | undefined
  public PaymentMethod: PaymentMethod | undefined
  public UserWallet: Wallet | undefined
  public AllPlans: Paginated<Plan> | undefined
  public AllTransactions: Paginated<Transaction> | undefined
  public PurchasedItems: String[]
  public AllCommercialBanks: CommercialBanks[] | undefined

  public MakePurchaseForm: MakePurchaseInput | undefined
  public FundWalletForm: FundWalletInput | undefined
  public UpdateAccountForm: UpdateAccountNumberInput | undefined

  public initialPayment = (amount = 0) => {
    $api.payment.transaction
      .post(null, {
        data: {
          type: 'newCard',
        },
      })
      .then((response) => {
        const transId = response.data.id
        $api.payment.transaction.getFlutterwaveKey().then((response) => {
          const publicToken = response.data.publicKey
          // @ts-ignore
          const paymentModal = FlutterwaveCheckout({
            public_key: publicToken,
            tx_ref: transId,
            amount: amount ? amount : 10,
            currency: 'NGN',
            payment_options: 'card',
            meta: {
              user_id: Logic.Auth.AuthUser?.id,
            },
            customer: {
              email: Logic.Auth.AuthUser.email,
              phone_number: `${Logic.Auth.AuthUser.phone?.code}${Logic.Auth.AuthUser.phone?.number}`,
              name: Logic.Auth.AuthUser.name.full,
            },
            onclose: function (incomplete) {
              //
            },
            callback: (payment) => {
              setTimeout(() => {
                $api.payment.transaction
                  .fulfillTransaction(transId)
                  .then(() => {
                    paymentModal.close()
                    const userQuery = {
                      where: [
                        {
                          field: 'userId',
                          condition: Conditions.eq,
                          value: Logic.Auth.AuthUser?.id,
                        },
                      ],
                    }
                    Logic.Payment.GetUserWallet()
                    Logic.Payment.GetTransactions(userQuery)
                    Logic.Payment.GetPaymentMethods(userQuery)
                  })
              }, 3000)
            },
          })
        })
      })
  }

  public GetUserWallet = () => {
    return $api.payment.wallet.getUserWallet().then((response) => {
      this.UserWallet = response.data
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

  public GetTransactions = (filter: QueryParams) => {
    return $api.payment.transaction.fetch(filter).then((response) => {
      this.AllTransactions = response.data
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

  public GetUserPurchases = (fetchItems: boolean) => {
    return new Promise((resolve) => {
      $api.payment.purchase
        .fetch({
          where: [
            {
              field: 'user.id',
              value: Logic.Auth.AuthUser?.id,
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
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.payment.wallet
        .fundWallet(this.FundWalletForm)
        .then((response) => {
          Logic.Payment.GetUserWallet()
          Logic.Payment.GetTransactions({
            where: [
              {
                field: 'userId',
                condition: Conditions.eq,
                value: Logic.Auth.AuthUser?.id,
              },
            ],
          })
          Logic.Common.hideLoader()
          return response.data
        })
        .catch(() => {
          Logic.Common.hideLoader()
        })
    }
  }

  public UpdateAccountNumber = () => {
    if (this.UpdateAccountForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.payment.wallet
        .updateAccountNumber(this.UpdateAccountForm)
        .then((response) => {
          Logic.Payment.GetUserWallet()
          Logic.Common.hideLoader()
          return response.data
        })
        .catch(() => {
          Logic.Common.hideLoader()
        })
    }
  }

  public WithdrawFromWallet = (amount: number) => {
    if (amount > 0) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.payment.wallet
        .withdrawFromWallet(amount)
        .then((response) => {
          Logic.Payment.GetUserWallet()
          Logic.Payment.GetTransactions({
            where: [
              {
                field: 'userId',
                condition: Conditions.eq,
                value: Logic.Auth.AuthUser?.id,
              },
            ],
          })
          Logic.Common.hideLoader()
          return response.data
        })
        .catch(() => {
          Logic.Common.hideLoader()
        })
    }
  }

  public MakePurchase = () => {
    if (this.MakePurchaseForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.payment.purchase
        .post(null, this.MakePurchaseForm)
        .then((response) => {
          Logic.Common.hideLoader()
          return response.data
        })
        .catch(() => {
          Logic.Common.hideLoader()
        })
    }
  }

  public SubscribeToPlan = (planId: string) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.payment.wallet
      .subscribeToPlan({
        planId: planId,
      })
      .then((response) => {
        Logic.Payment.GetUserWallet()
        Logic.Common.hideLoader()
        return response.data
      })
      .catch(() => {
        Logic.Common.hideLoader()
      })
  }

  public MakeMethodPrimary = (id: string) => {
    return $api.payment.paymentMethod
      .makePrimaryPaymentMethod(id)
      .then((response) => {
        this.PaymentMethod = response.data
      })
      .catch((error) => {
        //
      })
  }

  public DeleteMethod = (id: string) => {
    return $api.payment.paymentMethod
      .delete(id)
      .then((response) => {
        //
      })
      .catch((error) => {
        //
      })
  }
}
