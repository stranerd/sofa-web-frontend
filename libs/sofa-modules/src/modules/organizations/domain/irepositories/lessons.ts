import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { LessonToModel } from '../../data/models/lessons'
import { LessonEntity } from '../entities/lessons'

export interface ILessonRepository {
	add: (data: LessonToModel) => Promise<LessonEntity>
	get: (condition: QueryParams) => Promise<QueryResults<LessonEntity>>
	find: (id: string) => Promise<LessonEntity | null>
	update: (id: string, data: LessonToModel) => Promise<LessonEntity | null>
	delete: (id: string) => Promise<boolean>
	join: (data: { id: string; join: boolean }) => Promise<LessonEntity | null>
	manageTeachers: (data: { id: string; userId: string; add: boolean }) => Promise<LessonEntity | null>
	listenToOne: (id: string, listeners: Listeners<LessonEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listeners: Listeners<LessonEntity>,
		matches: (entity: LessonEntity) => boolean,
	) => Promise<() => void>
}
