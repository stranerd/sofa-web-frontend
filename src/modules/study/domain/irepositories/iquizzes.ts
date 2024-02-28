import { QuizToModel } from '../../data/models/quizzes'
import { QuizEntity } from '../entities/quizzes'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface IQuizRepository {
	add: (data: QuizToModel) => Promise<QuizEntity>
	get: (condition: QueryParams) => Promise<QueryResults<QuizEntity>>
	getTutors: (condition: QueryParams) => Promise<QueryResults<QuizEntity>>
	find: (id: string) => Promise<QuizEntity | null>
	similar: (id: string) => Promise<QuizEntity[]>
	update: (id: string, data: QuizToModel) => Promise<QuizEntity>
	delete: (id: string) => Promise<void>
	publish: (id: string) => Promise<QuizEntity>
	reorder: (id: string, questions: string[]) => Promise<QuizEntity>
	requestAccess(id: string, data: { add: boolean }): Promise<boolean>
	grantAccess(id: string, data: { userId: string; grant: boolean }): Promise<boolean>
	addMembers(id: string, data: { userIds: string[]; grant: boolean }): Promise<boolean>
	listenToOne: (id: string, listener: Listeners<QuizEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listener: Listeners<QuizEntity>, matches: (entity: QuizEntity) => boolean) => Promise<() => void>
	listenToManyTutors: (
		query: QueryParams,
		listener: Listeners<QuizEntity>,
		matches: (entity: QuizEntity) => boolean,
	) => Promise<() => void>
}
