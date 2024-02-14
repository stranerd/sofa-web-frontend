import { TransactionToModel } from '../../data/models/transactions'
import { TransactionEntity } from '../entities/transactions'
import { QueryParams, QueryResults, Listeners } from '@modules/core'

export interface ITransactionRepository {
	create: (data: TransactionToModel) => Promise<TransactionEntity>
	get: (query: QueryParams) => Promise<QueryResults<TransactionEntity>>
	find: (id: string) => Promise<TransactionEntity | null>
	update: (id: string, data: TransactionToModel) => Promise<TransactionEntity>
	listenToOne: (id: string, listeners: Listeners<TransactionEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listeners: Listeners<TransactionEntity>,
		matches: (entity: TransactionEntity) => boolean,
	) => Promise<() => void>
}
