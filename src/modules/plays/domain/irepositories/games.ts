import { GameToModel } from '../../data/models/games'
import { GameEntity } from '../entities/games'
import { QueryParams, QueryResults } from '@modules/core'

export interface IGameRepository {
	create: (data: GameToModel) => Promise<GameEntity>
	get: (condition: QueryParams) => Promise<QueryResults<GameEntity>>
	find: (id: string) => Promise<GameEntity | null>
	delete: (id: string) => Promise<boolean>
	start: (id: string) => Promise<GameEntity | null>
	join: (id: string, data: { join: boolean }) => Promise<GameEntity | null>
	end: (id: string) => Promise<GameEntity | null>
}
