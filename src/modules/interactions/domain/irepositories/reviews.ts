import { ReviewToModel } from '../../data/models/reviews'
import { ReviewEntity } from '../entities/reviews'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface IReviewRepository {
	add: (data: ReviewToModel) => Promise<ReviewEntity>
	get: (query: QueryParams) => Promise<QueryResults<ReviewEntity>>
	listenToOne: (id: string, listener: Listeners<ReviewEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<ReviewEntity>, matches: (entity: ReviewEntity) => boolean) => Promise<() => void>
	find: (id: string) => Promise<ReviewEntity | null>
}
