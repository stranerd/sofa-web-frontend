import { TagToModel } from '../../data/models/tags'
import { TagEntity } from '../entities/tags'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface ITagRepository {
	add: (data: TagToModel) => Promise<TagEntity>
	get: (query: QueryParams) => Promise<QueryResults<TagEntity>>
	listenToOne: (id: string, listener: Listeners<TagEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<TagEntity>, matches: (entity: TagEntity) => boolean) => Promise<() => void>
	find: (id: string) => Promise<TagEntity | null>
	update: (id: string, data: TagToModel) => Promise<TagEntity>
	delete: (id: string) => Promise<void>
}
