import { WithdrawalEntity } from '../entities/withdrawals'
import { QueryParams, QueryResults } from '@modules/core'

export interface IWithdrawalRepository {
	get: (query: QueryParams) => Promise<QueryResults<WithdrawalEntity>>
	find: (id: string) => Promise<WithdrawalEntity | null>
}
