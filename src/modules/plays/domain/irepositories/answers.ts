import { AnswerToModel } from '../../data/models/answers'
import { AnswerEntity } from '../entities/answers'
import { Listeners, QueryParams, QueryResults } from '@modules/core'

export interface IAnswerRepository {
	answer: (data: AnswerToModel) => Promise<AnswerEntity>
	get: (condition: QueryParams) => Promise<QueryResults<AnswerEntity>>
	find: (id: string) => Promise<AnswerEntity | null>
	end: () => Promise<AnswerEntity>
	listenToOne: (id: string, listeners: Listeners<AnswerEntity>) => Promise<() => void>
	listenToMany: (
		query: QueryParams,
		listeners: Listeners<AnswerEntity>,
		matches: (entity: AnswerEntity) => boolean,
	) => Promise<() => void>
}
