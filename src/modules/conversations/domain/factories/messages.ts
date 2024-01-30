import { v } from 'valleyed'
import { MessageToModel } from '../../data/models/messages'
import { MessageEntity } from '../entities/messages'
import { BaseFactory, Media } from '@modules/core'

export class MessageFactory extends BaseFactory<MessageEntity, MessageToModel, MessageToModel> {
	readonly rules = {
		body: v.string(),
		media: v.file().nullable(),
	}

	constructor() {
		super({ body: '', media: null })
	}

	get body() {
		return this.values.body
	}

	set body(value: string) {
		this.set('body', value)
	}

	get media() {
		return this.values.media
	}

	set media(value: Media | null) {
		this.set('media', value)
	}

	model = async () => {
		const { body, media } = this.validValues
		return { body, media }
	}

	loadEntity = (entity: MessageEntity) => {
		this.entityId = entity.id
		this.body = entity.body
		this.media = entity.media
	}
}
