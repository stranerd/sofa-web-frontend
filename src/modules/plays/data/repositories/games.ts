import { GameEntity } from '../../domain/entities/games'
import { IGameRepository } from '../../domain/irepositories/games'
import { PlayTypes } from '../../domain/types'
import { GameFromModel, GameToModel } from '../models/games'
import { PlayRepository } from './plays'

export class GameRepository extends PlayRepository<GameEntity, GameFromModel, GameToModel> implements IGameRepository {
	private static instance: GameRepository

	private constructor() {
		super(PlayTypes.games, (model: GameFromModel | null) => (model ? new GameEntity(model) : null) as GameEntity)
	}

	static getInstance() {
		if (!GameRepository.instance) GameRepository.instance = new GameRepository()
		return GameRepository.instance
	}

	async join(id: string, data: { join: boolean }) {
		const d = await this.client.post<typeof data, GameFromModel>(`/${id}/join`, data)
		return this.mapper(d)
	}
}
