import { IMetaMessageRepository } from '@modules/users/domain/irepositories/metaMessage'
import { HttpClient } from '@modules/core'
import { MetaMessageData } from '@modules/users/domain/types'

export class MetaMessageRepository implements IMetaMessageRepository {
	private static instance: MetaMessageRepository
	private client: HttpClient

	constructor() {
		this.client = new HttpClient('/meta/messages')
	}

	static getInstance() {
		if (!MetaMessageRepository.instance) MetaMessageRepository.instance = new MetaMessageRepository()
		return MetaMessageRepository.instance
	}

	async send(data: MetaMessageData) {
		return await this.client.post<MetaMessageData, boolean>('/', data)
	}
}
