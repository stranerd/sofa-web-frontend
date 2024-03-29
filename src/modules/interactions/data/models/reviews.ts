import { Interaction, InteractionEntity } from '../../domain/types'
import { EmbeddedUser } from '@modules/users'

export interface ReviewFromModel extends ReviewToModel {
	id: string
	user: EmbeddedUser
	entity: InteractionEntity
	createdAt: number
	updatedAt: number
}

export interface ReviewToModel {
	entity: Interaction
	rating: number
	message: string
}
