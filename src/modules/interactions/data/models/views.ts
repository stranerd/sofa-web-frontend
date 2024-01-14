import { EmbeddedUser } from '@modules/users'
import { Interaction, InteractionEntity } from '../../domain/types'

export interface ViewFromModel extends ViewToModel {
	id: string
	user: EmbeddedUser
	entity: InteractionEntity
	createdAt: number
	updatedAt: number
}

export interface ViewToModel {
	entity: Interaction
}
