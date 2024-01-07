import { Coursable, CourseMeta, CourseSections, Publishable, Saleable } from '../../domain/types'

export interface CourseFromModel extends CourseToModel, Publishable {
	id: string
	coursables: { id: string; type: Coursable }[]
	sections: CourseSections
	meta: Record<CourseMeta, number>
	createdAt: number
	updatedAt: number
}

export interface CourseToModel extends Omit<Publishable, 'ratings' | 'topicId' | 'tagIds' | 'user' | 'status'>, Saleable {
	topic: string
	tags: string[]
}
