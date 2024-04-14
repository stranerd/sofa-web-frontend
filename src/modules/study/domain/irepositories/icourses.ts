import { CourseToModel } from '../../data/models/courses'
import { CourseEntity } from '../entities/courses'
import { Coursable, CourseSection } from '../types'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface ICourseRepository {
	add: (data: CourseToModel) => Promise<CourseEntity>
	get: (condition: QueryParams) => Promise<QueryResults<CourseEntity>>
	find: (id: string) => Promise<CourseEntity | null>
	similar: (id: string) => Promise<CourseEntity[]>
	update: (id: string, data: CourseToModel) => Promise<CourseEntity>
	delete: (id: string) => Promise<void>
	publish: (id: string) => Promise<CourseEntity>
	freeze: (id: string) => Promise<CourseEntity>
	move: (id: string, coursable: { coursableId: string; type: Coursable; add: boolean }) => Promise<CourseEntity>
	updateSections: (id: string, sections: CourseSection[]) => Promise<CourseEntity>
	listenToOne: (id: string, listener: Listeners<CourseEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<CourseEntity>, matches: (entity: CourseEntity) => boolean) => Promise<() => void>
}
