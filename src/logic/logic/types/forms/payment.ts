export interface UpdateAccountNumberInput {
	country: string
	bankCode: string
	bankNumber: string
}

export interface WithdrawalFromWalletInput {
	amount: number
	account: UpdateAccountNumberInput
}
