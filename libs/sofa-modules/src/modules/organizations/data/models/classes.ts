import { Media } from '@modules/core'
import { EmbeddedUser, Saleable } from '../../domain/types'

export interface ClassFromModel extends ClassToModel, Saleable {
	id: string
	user: EmbeddedUser
	createdAt: number
	updatedAt: number
}

export interface ClassToModel extends Pick<Saleable, 'price'> {
	organizationId: string
	title: string
	description: string
	photo: Media | null
}
