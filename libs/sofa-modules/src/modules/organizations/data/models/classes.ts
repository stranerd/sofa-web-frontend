import { Media } from '@modules/core'
import { EmbeddedUser, Saleable } from '../../domain/types'

export interface ClassFromModel extends ClassToModel {
	id: string
	createdAt: number
	updatedAt: number
}

export interface ClassToModel extends Saleable {
	organizationId: string
	title: string
	description: string
	photo: Media | null
	user: EmbeddedUser
}