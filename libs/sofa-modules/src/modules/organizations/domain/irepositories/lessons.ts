import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { LessonToModel } from '../../data/models/lessons'
import { LessonEntity } from '../entities/lessons'

export interface ILessonRepository {
	add: (data: LessonToModel) => Promise<LessonEntity>
	get: (organizationId: string, classId: string, condition: QueryParams) => Promise<QueryResults<LessonEntity>>
	find: (organizationId: string, classId: string, id: string) => Promise<LessonEntity | null>
	update: (organizationId: string, classId: string, id: string, data: LessonToModel) => Promise<LessonEntity | null>
	delete: (organizationId: string, classId: string, id: string) => Promise<boolean>
	join: (data: { organizationId: string, classId: string, id: string, join: boolean }) => Promise<LessonEntity | null>
	manageTeachers: (data: { organizationId: string, classId: string, id: string, userId: string, add: boolean }) => Promise<LessonEntity | null>
	listenToOne: (organizationId: string, classId: string, id: string, listeners: Listeners<LessonEntity>) => Promise<() => void>
	listenToMany: (organizationId: string, classId: string, query: QueryParams, listeners: Listeners<LessonEntity>, matches: (entity: LessonEntity) => boolean) => Promise<() => void>
}