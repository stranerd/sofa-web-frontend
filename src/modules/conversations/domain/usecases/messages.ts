import { MessageEntity } from '../entities/messages'
import { MessageFactory } from '../factories/messages'
import { IMessageRepository } from '../irepositories/messages'
import { Conditions, Listeners, QueryParams } from '@modules/core'
import { DEFAULT_PAGINATION_LIMIT } from '@utils/constants'

export class MessagesUseCase {
	private repository: (conversationId: string) => IMessageRepository

	constructor(repository: (conversationId: string) => IMessageRepository) {
		this.repository = repository
	}

	async add(conversationId: string, factory: MessageFactory) {
		return await this.repository(conversationId).add(await factory.toModel())
	}

	async get(conversationId: string, date?: number) {
		const conditions: QueryParams = {
			where: [],
			sort: [{ field: 'createdAt', desc: true }],
			limit: DEFAULT_PAGINATION_LIMIT,
		}

		if (date) conditions.where!.push({ field: 'createdAt', condition: Conditions.lt, value: date })

		return await this.repository(conversationId).get(conditions)
	}

	async find(conversationId: string, id: string) {
		return await this.repository(conversationId).find(id)
	}

	async star(conversationId: string, id: string, starred: boolean) {
		return await this.repository(conversationId).star(id, starred)
	}

	async markRead(conversationId: string) {
		return await this.repository(conversationId).markRead()
	}

	async listenToOne(conversationId: string, id: string, listener: Listeners<MessageEntity>) {
		return await this.repository(conversationId).listenToOne(id, listener)
	}

	async listen(conversationId: string, listener: Listeners<MessageEntity>, date?: number) {
		const conditions: QueryParams = {
			where: [],
			sort: [{ field: 'createdAt', desc: true }],
			all: true,
		}
		if (date) conditions.where!.push({ field: 'createdAt', condition: Conditions.gte, value: date })

		return await this.repository(conversationId).listenToMany(conditions, listener, (entity) => {
			if (date) return entity.createdAt >= date
			else return true
		})
	}
}
