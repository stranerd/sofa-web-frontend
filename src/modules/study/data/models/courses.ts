import { CourseMeta, CourseSection, Publishable, Saleable } from '../../domain/types'

export interface CourseFromModel extends CourseToModel, Publishable, Saleable {
	id: string
	__type: 'CourseEntity'
	sections: CourseSection[]
	meta: Record<CourseMeta, number>
	createdAt: number
	updatedAt: number
}

export interface CourseToModel extends Omit<Publishable, 'ratings' | 'topicId' | 'tagIds' | 'user' | 'status'>, Omit<Saleable, 'frozen'> {
	topic: string
	tags: string[]
}
