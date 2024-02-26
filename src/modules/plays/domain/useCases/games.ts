import { GameToModel } from '../../data/models/games'
import { GameEntity } from '../entities/games'
import { IGameRepository } from '../irepositories/games'
import { PlaysUseCase } from './plays'
import { Conditions, Listeners, QueryKeys } from '@modules/core'

export class GamesUseCase extends PlaysUseCase<GameEntity, GameToModel, IGameRepository> {
	async getMine(userId: string) {
		return await this.repository.get({
			whereType: QueryKeys.or,
			where: [{ field: 'user.id', value: userId }],
			all: true,
		})
	}

	async listenToMine(userId: string, listeners: Listeners<GameEntity>) {
		return await this.repository.listenToMany(
			{
				whereType: QueryKeys.or,
				where: [
					{ field: 'user.id', value: userId },
					{ field: 'participants', condition: Conditions.in, value: userId },
				],
				all: true,
			},
			listeners,
			(e) => e.user.id === userId || e.participants.includes(userId),
		)
	}

	async join(id: string, data: { join: boolean }) {
		return await this.repository.join(id, data)
	}
}
