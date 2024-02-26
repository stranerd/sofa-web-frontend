import { WithdrawalEntity } from '../entities/withdrawals'
import { QueryParams, QueryResults, Listeners } from '@modules/core'

export interface IWithdrawalRepository {
	get: (query: QueryParams) => Promise<QueryResults<WithdrawalEntity>>
	find: (id: string) => Promise<WithdrawalEntity | null>
	listenToOne: (id: string, listeners: Listeners<WithdrawalEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listeners: Listeners<WithdrawalEntity>,
		matches: (entity: WithdrawalEntity) => boolean,
	) => Promise<() => void>
}
