import { BaseFactory } from '@modules/core'
import { v } from 'valleyed'
import { CreateConversationToModel } from '../../data/models/conversations'
import { ConversationEntity } from '../entities/conversations'

export class ConversationFactory extends BaseFactory<ConversationEntity, CreateConversationToModel, CreateConversationToModel> {
	readonly rules = {
		body: v.string().min(1, true),
		tutorId: v.string().min(1).nullable(),
	}

	constructor() {
		super({ body: '', tutorId: null })
	}

	get body() {
		return this.values.body
	}

	set body(value: string) {
		this.set('body', value)
	}

	get tutorId() {
		return this.values.tutorId
	}

	set tutorId(value: string | null) {
		this.set('tutorId', value)
	}

	loadEntity = (entity: ConversationEntity) => {
		this.entityId = entity.id
		this.body = entity.title
		this.tutorId = entity.tutor?.id ?? null
	}

	toModel = async () => {
		if (this.valid) {
			const { body, tutorId } = this.validValues
			return { body, tutorId }
		} else {
			throw new Error('Validation errors')
		}
	}
}
