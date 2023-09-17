export interface CreateTransactionInput {
  data: {
    type: string
  }
}

export interface MakePurchaseInput {
  type: string
  id: string
  methodId: string
}

export interface FundWalletInput {
  amount: number
  methodId: string
}

export interface UpdateAccountNumberInput {
  country: string
  bankCode: string
  bankNumber: string
}
