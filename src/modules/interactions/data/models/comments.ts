import { CommentMeta, Interaction, InteractionEntity } from '../../domain/types'
import { EmbeddedUser } from '@modules/users'

export interface CommentFromModel extends CommentToModel {
	id: string
	user: EmbeddedUser
	entity: InteractionEntity
	meta: CommentMeta
	createdAt: number
	updatedAt: number
}

export interface CommentToModel {
	entity: Interaction
	body: string
}
