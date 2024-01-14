import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { CreateConversationToModel, UpdateConversationToModel } from '../../data/models/conversations'
import { ConversationEntity } from '../entities/conversations'

export interface IConversationRepository {
	add: (data: CreateConversationToModel) => Promise<ConversationEntity>
	get: (condition: QueryParams) => Promise<QueryResults<ConversationEntity>>
	find: (id: string) => Promise<ConversationEntity | null>
	delete: (id: string) => Promise<void>
	update: (id: string, data: UpdateConversationToModel) => Promise<ConversationEntity>
	accept: (id: string, data: { accept: boolean }) => Promise<ConversationEntity>
	end: (id: string, data: { rating: number; message: string }) => Promise<ConversationEntity>
	listenToOne: (id: string, listener: Listeners<ConversationEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listener: Listeners<ConversationEntity>,
		matches: (entity: ConversationEntity) => boolean,
	) => Promise<() => void>
}
