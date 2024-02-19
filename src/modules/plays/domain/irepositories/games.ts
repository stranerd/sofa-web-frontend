import { GameToModel } from '../../data/models/games'
import { GameEntity } from '../entities/games'
import { QuestionFromModel } from '@modules/study/data/models/questions'
import { QueryParams, QueryResults } from '@modules/core'

export interface IGameRepository {
	create: (data: GameToModel) => Promise<GameEntity>
	get: (condition: QueryParams) => Promise<QueryResults<GameEntity>>
	find: (id: string) => Promise<GameEntity | null>
	delete: (id: string) => Promise<boolean>
	start: (id: string) => Promise<GameEntity>
	join: (id: string, data: { join: boolean }) => Promise<GameEntity>
	end: (id: string) => Promise<GameEntity>
	getQuestions: (id: string) => Promise<QuestionFromModel[]>
}
