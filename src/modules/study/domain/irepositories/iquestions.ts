import { QuestionToModel } from '../../data/models/questions'
import { QuestionEntity } from '../entities/questions'
import { CoursableAccess } from '../types'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface IQuestionRepository {
	add: (data: QuestionToModel) => Promise<QuestionEntity>
	get: (condition: QueryParams & CoursableAccess) => Promise<QueryResults<QuestionEntity>>
	find: (id: string, access: CoursableAccess) => Promise<QuestionEntity | null>
	update: (id: string, data: QuestionToModel) => Promise<QuestionEntity | null>
	delete: (id: string) => Promise<boolean>
	listenToOne: (id: string, listener: Listeners<QuestionEntity>, query: CoursableAccess) => Promise<() => void>
	listenToMany: (
		query: QueryParams & CoursableAccess,
		listener: Listeners<QuestionEntity>,
		matches: (entity: QuestionEntity) => boolean,
	) => Promise<() => void>
}
