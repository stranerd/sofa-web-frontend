import { IMetaMessageRepository } from '../../domain/irepositories/imetaMessage'
import { MetaMessageData } from '../../domain/types'
import { HttpClient } from '@modules/core'

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
