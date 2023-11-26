import { v } from 'valleyed'
import { FileData, Message } from '../../logic'
import { BaseFactory } from '../base'

type Content = FileData | null
type Keys = { body: string, media: Content | null }

export class MessageFactory extends BaseFactory<Message, Keys, Keys> {
	readonly rules = {
		body: v.string(),
		media: v.any()//.file().nullable()
	}

	reserved = []

	constructor () {
		super({ body: '', media: null })
	}

	get body () {
		return this.values.body
	}

	set body (value: string) {
		this.set('body', value)
	}

	get media () {
		return this.values.media
	}

	set media (value: Content) {
		this.set('media', value)
	}

	toModel = async () => {
		if (this.valid) {
			const { body, media } = this.validValues
			return { body, media: null }
		} else {
			throw new Error('Validation errors')
		}
	}

	loadEntity = (entity: Message) => {
		this.body = entity.body
		this.media = entity.media
	}
}
