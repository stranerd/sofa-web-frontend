import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { MessageEntity } from '../../domain/entities/messages'
import { IMessageRepository } from '../../domain/irepositories/messages'
import { MessageFromModel, MessageToModel } from '../models/messages'

export class MessageRepository implements IMessageRepository {
	private static instances: Record<string, MessageRepository> = {}
	private client: HttpClient
	private mapper = (model: MessageFromModel | null) => (model ? new MessageEntity(model) : null) as MessageEntity

	private constructor(conversationId: string) {
		this.client = new HttpClient(`/conversations/conversations/${conversationId}/messages`)
	}

	static getInstance(conversationId: string) {
		return (MessageRepository.instances[conversationId] ??= new MessageRepository(conversationId))
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<MessageFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)!),
		}
	}

	async add(data: MessageToModel) {
		const d = await this.client.post<MessageToModel, MessageFromModel>('/', data)
		return this.mapper(d)!
	}

	async update(id: string, data: MessageToModel) {
		const d = await this.client.put<MessageToModel, MessageFromModel>(`/${id}`, data)
		return this.mapper(d)!
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, MessageFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async delete(id: string) {
		return await this.client.delete<unknown, boolean>(`/${id}`, {})
	}

	async listenToOne(id: string, listeners: Listeners<MessageEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<MessageEntity>, matches: (entity: MessageEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async star(id: string, starred: boolean) {
		const d = await this.client.post<unknown, MessageFromModel>(`/${id}/star`, { starred })
		return this.mapper(d)!
	}

	async markRead() {
		return await this.client.put<unknown, boolean>('/read', {})
	}
}
