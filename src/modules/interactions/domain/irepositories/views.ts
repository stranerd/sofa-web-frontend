import { ViewToModel } from '../../data/models/views'
import { ViewEntity } from '../entities/views'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface IViewRepository {
	add: (data: ViewToModel) => Promise<ViewEntity>
	get: (query: QueryParams) => Promise<QueryResults<ViewEntity>>
	listenToOne: (id: string, listener: Listeners<ViewEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<ViewEntity>, matches: (entity: ViewEntity) => boolean) => Promise<() => void>
	find: (id: string) => Promise<ViewEntity | null>
}
