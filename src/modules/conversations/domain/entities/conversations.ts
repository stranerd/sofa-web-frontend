import { ConversationFromModel } from '../../data/models/conversations'
import { MessageEntity } from './messages'
import { BaseEntity } from '@modules/core'

export class ConversationEntity extends BaseEntity<ConversationFromModel> {
	constructor(data: ConversationFromModel) {
		data.last = data.last ? new MessageEntity(data.last) : null
		super(data)
	}

	get isActive() {
		return !this.pending && !!this.accepted?.is && !this.ended && !!this.tutor
	}
}
