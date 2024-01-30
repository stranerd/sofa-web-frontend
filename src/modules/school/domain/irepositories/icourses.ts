import { CourseToModel } from '../../data/models/courses'
import { CourseEntity } from '../entities/courses'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface ICourseRepository {
	add: (data: CourseToModel) => Promise<CourseEntity>
	get: (query: QueryParams) => Promise<QueryResults<CourseEntity>>
	listenToOne: (id: string, listener: Listeners<CourseEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<CourseEntity>, matches: (entity: CourseEntity) => boolean) => Promise<() => void>
	find: (id: string) => Promise<CourseEntity | null>
	update: (id: string, data: CourseToModel) => Promise<CourseEntity>
	delete: (id: string) => Promise<void>
}
