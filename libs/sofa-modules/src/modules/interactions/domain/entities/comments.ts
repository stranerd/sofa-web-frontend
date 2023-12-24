import { BaseEntity } from '@modules/core'
import { EmbeddedUser } from '@modules/users'
import { CommentFromModel } from '../../data/models/comments'
import { CommentMeta, InteractionEntities, InteractionEntity } from '../types'

export class CommentEntity extends BaseEntity {
	public readonly id: string
	public readonly body: string
	public readonly entity: InteractionEntity
	public readonly user: EmbeddedUser
	public readonly meta: CommentMeta
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, body, entity, user, meta, createdAt, updatedAt }: CommentFromModel) {
		super()
		this.id = id
		this.body = body
		this.entity = entity
		this.user = user
		this.meta = meta
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	get canReply () {
		return this.entity.type !== InteractionEntities.comments
	}
}
