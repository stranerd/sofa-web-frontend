import { PlanEntity } from '../entities/plans'
import { QueryParams, QueryResults, Listeners } from '@modules/core'

export interface IPlanRepository {
	get: (query: QueryParams) => Promise<QueryResults<PlanEntity>>
	find: (id: string) => Promise<PlanEntity | null>
	listenToOne: (id: string, listeners: Listeners<PlanEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listeners: Listeners<PlanEntity>, matches: (entity: PlanEntity) => boolean) => Promise<() => void>
}
