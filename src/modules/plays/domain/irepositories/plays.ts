import { PlayToModel } from '../../data/models/plays'
import { PlayEntity } from '../entities/plays'
import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { CoursableAccess, QuestionEntity } from '@modules/study'

export interface IPlayRepository<E extends PlayEntity, T extends PlayToModel> {
	create: (data: T, access: CoursableAccess['access']) => Promise<E>
	get: (condition: QueryParams) => Promise<QueryResults<E>>
	find: (id: string) => Promise<E | null>
	delete: (id: string) => Promise<boolean>
	start: (id: string) => Promise<E>
	end: (id: string) => Promise<E>
	getQuestions: (id: string) => Promise<QuestionEntity[]>
	listenToOne: (id: string, listeners: Listeners<E>) => Promise<() => void>
	listenToMany: (query: QueryParams, listeners: Listeners<E>, matches: (entity: E) => boolean) => Promise<() => void>
}