import { PurchaseToModel } from '../../data/models/purchases'
import { PurchaseEntity } from '../entities/purchases'
import { QueryParams, QueryResults, Listeners } from '@modules/core'

export interface IPurchaseRepository {
	create: (data: PurchaseToModel) => Promise<PurchaseEntity>
	get: (query: QueryParams) => Promise<QueryResults<PurchaseEntity>>
	find: (id: string) => Promise<PurchaseEntity | null>
	listenToOne: (id: string, listeners: Listeners<PurchaseEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listeners: Listeners<PurchaseEntity>,
		matches: (entity: PurchaseEntity) => boolean,
	) => Promise<() => void>
}
