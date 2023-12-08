import { Conversation } from '../../logic'
import { v } from 'valleyed'
import { BaseFactory } from '../base'

export class ConversationFactory extends BaseFactory<Conversation, { title: string }, { title: string }> {
	readonly rules = {
		title: v.string().min(1, true),
	}

	reserved = []

	constructor () {
		super({ title: '' })
	}

	get title () {
		return this.values.title
	}

	set title (value: string) {
		this.set('title', value)
	}
	loadEntity = (entity: Conversation) => {
		this.entityId = entity.id
		this.title = entity.title
	}

	toModel = async () => {
		if (this.valid) {
			const { title } = this.validValues
			return { title }
		} else {
			throw new Error('Validation errors')
		}
	}
}
