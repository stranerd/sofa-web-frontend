import { CommentFromModel } from '../../data/models/comments'
import { InteractionEntities } from '../types'
import { BaseEntity } from '@modules/core'

export class CommentEntity extends BaseEntity<CommentFromModel> {
	constructor(data: CommentFromModel) {
		super(data)
	}

	get canReply() {
		return this.entity.type !== InteractionEntities.comments
	}
}
