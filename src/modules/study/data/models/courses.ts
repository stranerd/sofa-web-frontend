import { Coursable, CourseMeta, CourseSections, Publishable, Saleable } from '../../domain/types'

export interface CourseFromModel extends CourseToModel, Publishable, Saleable {
	id: string
	__type: 'CourseEntity'
	coursables: { id: string; type: Coursable }[]
	sections: CourseSections
	meta: Record<CourseMeta, number>
	createdAt: number
	updatedAt: number
}

export interface CourseToModel extends Omit<Publishable, 'ratings' | 'topicId' | 'tagIds' | 'user' | 'status'>, Omit<Saleable, 'frozen'> {
	topic: string
	tags: string[]
}
