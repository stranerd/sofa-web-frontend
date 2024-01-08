import { Listeners } from '@modules/core'
import { CreateConversationToModel } from '../../data/models/conversations'
import { ConversationEntity } from '../entities/conversations'
import { IConversationRepository } from '../irepositories/conversations'

export class ConversationsUseCase {
	private repository: IConversationRepository

	constructor(repository: () => IConversationRepository) {
		this.repository = repository()
	}

	async add(data: CreateConversationToModel) {
		return await this.repository.add(data)
	}

	async update(id: string, title: string) {
		return await this.repository.update(id, { title })
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async accept(id: string, accept: boolean) {
		return await this.repository.accept(id, { accept })
	}

	async end(id: string, data: { rating: number; message: string }) {
		return await this.repository.end(id, data)
	}

	async listenToOne(id: string, listener: Listeners<ConversationEntity>) {
		return await this.repository.listenToOne(id, listener)
	}

	async getAll() {
		return await this.repository.get({ all: true })
	}

	async listenToAll(listener: Listeners<ConversationEntity>) {
		return await this.repository.listenToMany({ all: true }, listener, () => true)
	}
}
