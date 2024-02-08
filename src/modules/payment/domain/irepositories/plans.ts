import { PlanEntity } from '../entities/plans'
import { QueryParams, QueryResults } from '@modules/core'

export interface IPlanRepository {
	get: (query: QueryParams) => Promise<QueryResults<PlanEntity>>
	find: (id: string) => Promise<PlanEntity | null>
}
