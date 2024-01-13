import { HttpClient, Listeners, QueryParams, QueryResults, listenToMany, listenToOne } from '@modules/core'
import { ConversationEntity } from '../../domain/entities/conversations'
import { IConversationRepository } from '../../domain/irepositories/conversations'
import { ConversationFromModel, CreateConversationToModel, UpdateConversationToModel } from '../models/conversations'

export class ConversationRepository implements IConversationRepository {
	private static instance: ConversationRepository
	private client: HttpClient
	private mapper = (model: ConversationFromModel | null) => (model ? new ConversationEntity(model) : null)

	constructor() {
		this.client = new HttpClient('/conversations/conversations')
	}

	static getInstance() {
		if (!ConversationRepository.instance) ConversationRepository.instance = new ConversationRepository()
		return ConversationRepository.instance
	}

	async add(data: CreateConversationToModel) {
		const d = await this.client.post<CreateConversationToModel, ConversationFromModel>('/', data)
		return this.mapper(d)
	}

	async find(id: string) {
		const d = await this.client.get<any, ConversationFromModel>(`/${id}`, {})
		return this.mapper(d)
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<ConversationFromModel>>('/', query)
		return {
			...d,
			results: d.results.map(this.mapper),
		}
	}

	async listenToOne(id: string, listeners: Listeners<ConversationEntity>) {
		const model = await this.find(id)
		if (model) await listeners.updated(model)
		return await listenToOne(`${this.client.socketPath}/${id}`, listeners, this.mapper)
	}

	async listenToMany(query: QueryParams, listeners: Listeners<ConversationEntity>, matches: (entity: ConversationEntity) => boolean) {
		const models = await this.get(query)
		await Promise.all(models.results.map(listeners.updated))
		return await listenToMany(this.client.socketPath, listeners, this.mapper, matches)
	}

	async delete(id: string) {
		await this.client.delete<any, boolean>(`/${id}`, {})
	}

	async update(id: string, data: UpdateConversationToModel) {
		const d = await this.client.put<UpdateConversationToModel, ConversationFromModel>(`/${id}`, data)
		return this.mapper(d)
	}

	async accept(id: string) {
		const d = await this.client.post<any, ConversationFromModel>(`/${id}/accept`, {})
		return this.mapper(d)
	}

	async end(id: string) {
		const d = await this.client.post<any, ConversationFromModel>(`/${id}/end`, {})
		return this.mapper(d)
	}
}
