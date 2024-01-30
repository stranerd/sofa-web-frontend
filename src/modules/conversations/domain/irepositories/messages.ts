import { MessageToModel } from '../../data/models/messages'
import { MessageEntity } from '../entities/messages'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface IMessageRepository {
	add: (data: MessageToModel) => Promise<MessageEntity>
	get: (condition: QueryParams) => Promise<QueryResults<MessageEntity>>
	find: (id: string) => Promise<MessageEntity | null>
	star: (id: string, starred: boolean) => Promise<MessageEntity | null>
	markRead: () => Promise<boolean>
	listenToOne: (id: string, listener: Listeners<MessageEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listener: Listeners<MessageEntity>,
		matches: (entity: MessageEntity) => boolean,
	) => Promise<() => void>
}
