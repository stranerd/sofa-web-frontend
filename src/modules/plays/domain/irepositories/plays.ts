import { PlayToModel } from '../../data/models/plays'
import { PlayEntity } from '../entities/plays'
import { Listeners, QueryParams, QueryResults } from '@modules/core'
import { CoursableAccess, QuestionEntity } from '@modules/study'

export interface IPlayRepository {
	create: (data: PlayToModel, access: CoursableAccess['access']) => Promise<PlayEntity>
	get: (condition: QueryParams) => Promise<QueryResults<PlayEntity>>
	find: (id: string) => Promise<PlayEntity | null>
	delete: (id: string) => Promise<boolean>
	start: (id: string) => Promise<PlayEntity>
	end: (id: string) => Promise<PlayEntity>
	getQuestions: (id: string) => Promise<QuestionEntity[]>
	listenToOne: (id: string, listeners: Listeners<PlayEntity>) => Promise<() => void>
	listenToMany: (query: QueryParams, listeners: Listeners<PlayEntity>, matches: (entity: PlayEntity) => boolean) => Promise<() => void>
	join: (id: string, data: { join: boolean }) => Promise<PlayEntity>
	export: (id: string) => Promise<string>
}
