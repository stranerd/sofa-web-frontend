import { LikeEntity } from '../entities/likes'
import { ILikeRepository } from '../irepositories/likes'
import { Interaction, InteractionEntities } from '../types'
import { Conditions, Listeners, QueryParams } from '@modules/core'

export class LikesUseCase {
	private repository: ILikeRepository

	constructor(repository: () => ILikeRepository) {
		this.repository = repository()
	}

	async add(entity: Interaction, value: boolean) {
		return await this.repository.add({ entity, value })
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async getInList(userId: string, entityIds: string[], type: InteractionEntities) {
		const conditions: QueryParams = {
			where: [
				{ field: 'user.id', value: userId },
				{ field: 'entity.type', value: type },
				{ field: 'entity.id', value: entityIds, condition: Conditions.in },
			],
			all: true,
		}

		return await this.repository.get(conditions)
	}

	async listenToOne(id: string, listener: Listeners<LikeEntity>) {
		return await this.repository.listenToOne(id, listener)
	}
}
