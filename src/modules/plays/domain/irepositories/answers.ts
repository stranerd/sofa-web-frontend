import { AnswerToModel } from '../../data/models/answers'
import { AnswerEntity } from '../entities/answers'
import { QueryParams, QueryResults } from '@modules/core'

export interface IAnswerRepository {
	answer: (data: AnswerToModel & { questionId: string; answer: any }) => Promise<AnswerEntity | null>
	get: (condition: QueryParams) => Promise<QueryResults<AnswerEntity>>
	find: (id: string) => Promise<AnswerEntity | null>
}