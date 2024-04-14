import { v } from 'valleyed'
import { CreateConversationToModel } from '../../data/models/conversations'
import { ConversationEntity } from '../entities/conversations'
import { BaseFactory } from '@modules/core'

export class ConversationFactory extends BaseFactory<ConversationEntity, CreateConversationToModel, CreateConversationToModel> {
	readonly rules = {
		body: v.string().min(1, true),
		tutorId: v.string().min(1).nullable(),
	}

	constructor() {
		super({ body: '', tutorId: null })
	}

	load = (entity: ConversationEntity) => {
		this.entityId = entity.id
		this.body = entity.title
		this.tutorId = entity.tutor?.id ?? null
	}

	model = () => {
		const { body, tutorId } = this.validValues
		return { body, tutorId }
	}
}
