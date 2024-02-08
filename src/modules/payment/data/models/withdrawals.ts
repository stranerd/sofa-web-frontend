import { AccountDetails, Currencies, WithdrawalStatus } from '../../domain/types'
export interface WithdrawalFromModel {
	id: string
	userId: string
	email: string
	amount: number
	fee: number
	currency: Currencies
	status: WithdrawalStatus
	account: AccountDetails
	externalId: number | null
	createdAt: number
	updatedAt: number
}
