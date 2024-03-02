import { IMetaMessageRepository } from '../irepositories/metaMessage'
import { MetaMessageData } from '../types'

export class MetaMessageUseCase {
	private repository: IMetaMessageRepository
	constructor(repository: () => IMetaMessageRepository) {
		this.repository = repository()
	}

	async send(data: MetaMessageData) {
		return await this.repository.send(data)
	}
}
