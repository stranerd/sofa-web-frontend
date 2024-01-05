import { valleyed } from '@utils/commons'
import { FileData, Message } from '../../logic'
import { BaseFactory } from '@modules/core'

type Content = FileData | null
type Keys = { body: string; media: Content | null }

const v = valleyed.v
export class MessageFactory extends BaseFactory<Message, Keys, Keys> {
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

	set media(value: Content) {
		this.set('media', value)
	}

	toModel = async () => {
		if (this.valid) {
			const { body, media } = this.validValues
			return { body, media }
		} else {
			throw new Error('Validation errors')
		}
	}

	loadEntity = (entity: Message) => {
		this.entityId = entity.id
		this.body = entity.body
		this.media = entity.media
	}
}
