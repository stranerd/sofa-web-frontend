import { Media } from '@modules/core'
import { ClassLesson, EmbeddedUser, Saleable } from '../../domain/types'

export interface ClassFromModel extends ClassToModel, Saleable {
	id: string
	organizationId: string
	user: EmbeddedUser
	lessons: ClassLesson[]
	createdAt: number
	updatedAt: number
}

export interface ClassToModel extends Pick<Saleable, 'price'> {
	title: string
	description: string
	photo: Media | null
}
