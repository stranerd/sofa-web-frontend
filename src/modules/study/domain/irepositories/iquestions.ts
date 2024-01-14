import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { QuestionToModel } from '../../data/models/questions'
import { QuestionEntity } from '../entities/questions'

export interface IQuestionRepository {
	add: (data: QuestionToModel) => Promise<QuestionEntity>
	get: (condition: QueryParams) => Promise<QueryResults<QuestionEntity>>
	find: (id: string) => Promise<QuestionEntity | null>
	update: (id: string, data: QuestionToModel) => Promise<QuestionEntity | null>
	delete: (id: string) => Promise<boolean>
	listenToOne: (id: string, listener: Listeners<QuestionEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listener: Listeners<QuestionEntity>,
		matches: (entity: QuestionEntity) => boolean,
	) => Promise<() => void>
}
