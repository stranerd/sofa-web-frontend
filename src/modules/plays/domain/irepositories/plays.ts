import { PlayEntity } from '../entities/plays'
import { Listeners, QueryParams, QueryResults } from '@modules/core'
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
	listenToOne: (id: string, listeners: Listeners<E>) => Promise<() => void>
	listenToMany: (query: QueryParams, listeners: Listeners<E>, matches: (entity: E) => boolean) => Promise<() => void>
}
