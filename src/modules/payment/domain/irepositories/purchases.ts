import { PurchaseToModel } from '../../data/models/purchases'
import { PurchaseEntity } from '../entities/purchases'
import { QueryParams, QueryResults } from '@modules/core'

export interface IPurchaseRepository {
	create: (data: PurchaseToModel) => Promise<PurchaseEntity>
	get: (query: QueryParams) => Promise<QueryResults<PurchaseEntity>>
	find: (id: string) => Promise<PurchaseEntity | null>
}
