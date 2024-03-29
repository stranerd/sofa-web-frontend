import { ClassLesson, ClassMembers, EmbeddedUser, Saleable } from '../../domain/types'
import { Media } from '@modules/core'

export interface ClassFromModel extends ClassToModel, Saleable {
	id: string
	organizationId: string
	user: EmbeddedUser
	lessons: ClassLesson[]
	members: ClassMembers
	createdAt: number
	updatedAt: number
}

export interface ClassToModel extends Pick<Saleable, 'price'> {
	title: string
	description: string
	photo: Media | null
}
