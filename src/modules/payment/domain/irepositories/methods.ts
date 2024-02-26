import { MethodEntity } from '../entities/methods'
import { QueryParams, QueryResults, Listeners } from '@modules/core'

export interface IMethodRepository {
	get: (query: QueryParams) => Promise<QueryResults<MethodEntity>>
	find: (id: string) => Promise<MethodEntity | null>
	makePrimary: (id: string) => Promise<MethodEntity | null>
	delete: (id: string) => Promise<boolean>
	listenToOne: (id: string, listeners: Listeners<MethodEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listeners: Listeners<MethodEntity>,
		matches: (entity: MethodEntity) => boolean,
	) => Promise<() => void>
}
