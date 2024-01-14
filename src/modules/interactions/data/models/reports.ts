import { EmbeddedUser } from '@modules/users'
import { Interaction, InteractionEntity } from '../../domain/types'

export interface ReportFromModel extends ReportToModel {
	id: string
	user: EmbeddedUser
	entity: InteractionEntity
	createdAt: number
	updatedAt: number
}

export interface ReportToModel {
	entity: Interaction
	message: string
}
