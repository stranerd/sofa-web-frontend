import { AnswerToModel } from '../../data/models/answers'
import { AnswerEntity } from '../entities/answers'
import { QueryParams, QueryResults } from '@modules/core'

export interface IAnswerRepository {
	answer: (data: AnswerToModel) => Promise<AnswerEntity | null>
	get: (condition: QueryParams) => Promise<QueryResults<AnswerEntity>>
	find: (id: string) => Promise<AnswerEntity | null>
}
