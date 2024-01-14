import { Interaction, InteractionEntity } from '../../domain/types'
import { EmbeddedUser } from '@modules/users'

export interface LikeFromModel extends LikeToModel {
	id: string
	user: EmbeddedUser
	entity: InteractionEntity
	createdAt: number
	updatedAt: number
}

export interface LikeToModel {
	entity: Interaction
	value: boolean
}
