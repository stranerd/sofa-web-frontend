import { GameToModel } from '../../data/models/games'
import { GameEntity } from '../entities/games'
import { IPlayRepository } from './plays'

export interface IGameRepository extends IPlayRepository<GameEntity, GameToModel> {
	join: (id: string, data: { join: boolean }) => Promise<GameEntity>
}
