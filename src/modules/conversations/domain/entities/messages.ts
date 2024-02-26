import { MessageFromModel } from '../../data/models/messages'
import { BaseEntity } from '@modules/core'

export class MessageEntity extends BaseEntity<MessageFromModel> {
	constructor(data: MessageFromModel) {
		super(data)
	}
}
