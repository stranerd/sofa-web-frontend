import { GameToModel } from '../../data/models/games'
import { IGameRepository } from '../irepositories/games'
import { GameEntity } from '../entities/games'
import { PlaysUseCase } from './plays'

export class GamesUseCase extends PlaysUseCase<GameEntity, GameToModel, IGameRepository> {
	async join(id: string, data: { join: boolean }) {
		return await this.repository.join(id, data)
	}
}
