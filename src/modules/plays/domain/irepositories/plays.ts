import { PlayEntity } from '../entities/plays'
import { QueryParams, QueryResults } from '@modules/core'
import { PlayToModel } from '@modules/plays/data/models/plays'
import { QuestionEntity } from '@modules/study'

export interface IPlayRepository<E extends PlayEntity, T extends PlayToModel> {
	create: (data: T) => Promise<E>
	get: (condition: QueryParams) => Promise<QueryResults<E>>
	find: (id: string) => Promise<E | null>
	delete: (id: string) => Promise<boolean>
	start: (id: string) => Promise<E>
	end: (id: string) => Promise<E>
	getQuestions: (id: string) => Promise<QuestionEntity[]>
}
