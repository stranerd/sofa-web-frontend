import { MethodEntity } from '../entities/methods'
import { QueryParams, QueryResults } from '@modules/core'

export interface IMethodRepository {
	get: (query: QueryParams) => Promise<QueryResults<MethodEntity>>
	find: (id: string) => Promise<MethodEntity | null>
	makePrimary: (id: string) => Promise<MethodEntity | null>
	delete: (id: string) => Promise<boolean>
}
