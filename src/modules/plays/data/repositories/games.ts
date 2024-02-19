import { GameFromModel, GameToModel } from '../models/games'
import { PlayRepository } from './plays'
import { IGameRepository } from '@modules/plays/domain/irepositories/games'
import { GameEntity } from '@modules/plays/domain/entities/games'
import { PlayTypes } from '@modules/plays/domain/types'

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
