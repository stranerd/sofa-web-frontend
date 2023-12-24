import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { LikeToModel } from '../../data/models/likes'
import { LikeEntity } from '../entities/likes'

export interface ILikeRepository {
	add: (data: LikeToModel) => Promise<LikeEntity>
	get: (query: QueryParams) => Promise<QueryResults<LikeEntity>>
	listenToOne: (id: string, listener: Listeners<LikeEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<LikeEntity>, matches: (entity: LikeEntity) => boolean) => Promise<() => void>
	find: (id: string) => Promise<LikeEntity | null>
}
