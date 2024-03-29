import { CommentToModel } from '../../data/models/comments'
import { CommentEntity } from '../entities/comments'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface ICommentRepository {
	add: (data: CommentToModel) => Promise<CommentEntity>
	get: (query: QueryParams) => Promise<QueryResults<CommentEntity>>
	listenToOne: (id: string, listener: Listeners<CommentEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listener: Listeners<CommentEntity>,
		matches: (entity: CommentEntity) => boolean,
	) => Promise<() => void>
	find: (id: string) => Promise<CommentEntity | null>
	update: (id: string, data: CommentToModel) => Promise<CommentEntity>
	delete: (id: string) => Promise<void>
}
