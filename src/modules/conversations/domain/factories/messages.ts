import { v } from 'valleyed'
import { MessageToModel } from '../../data/models/messages'
import { MessageEntity } from '../entities/messages'
import { BaseFactory } from '@modules/core'

export class MessageFactory extends BaseFactory<MessageEntity, MessageToModel, MessageToModel> {
	readonly rules = {
		body: v.string(),
		media: v.file().nullable(),
	}

	constructor() {
		super({ body: '', media: null })
	}

	model = () => {
		const { body, media } = this.validValues
		return { body, media }
	}

	load = (entity: MessageEntity) => {
		this.entityId = entity.id
		this.body = entity.body
		this.media = entity.media
	}
}
