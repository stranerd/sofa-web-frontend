import { Coursable, CourseMeta, CourseSections, Publishable, Saleable } from '../../domain/types'

export interface CourseFromModel extends CourseToModel {
	id: string
	coursables: { id: string; type: Coursable }[]
	sections: CourseSections
	meta: Record<CourseMeta, number>
	ratings: Publishable['ratings']
	createdAt: number
	updatedAt: number
}

export interface CourseToModel extends Omit<Publishable, 'ratings'>, Saleable {}
