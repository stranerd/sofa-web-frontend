import { ReviewEntity } from '../entities/reviews'
import { ReviewFactory } from '../factories/reviews'
import { IReviewRepository } from '../irepositories/reviews'
import { Interaction } from '../types'
import { Listeners, QueryParams } from '@modules/core'

export class ReviewsUseCase {
	private repository: IReviewRepository

	constructor(repository: () => IReviewRepository) {
		this.repository = repository()
	}

	async getForEntity(entity: Interaction) {
		const query: QueryParams = {
			where: [
				{ field: 'entity.type', value: entity.type },
				{ field: 'entity.id', value: entity.id },
			],
			all: true,
			sort: [{ field: 'createdAt', desc: true }],
		}
		return await this.repository.get(query)
	}

	async listenForEntity(entity: Interaction, listeners: Listeners<ReviewEntity>) {
		const query: QueryParams = {
			where: [
				{ field: 'entity.type', value: entity.type },
				{ field: 'entity.id', value: entity.id },
			],
			all: true,
			sort: [{ field: 'createdAt', desc: true }],
		}
		return await this.repository.listenToMany(
			query,
			listeners,
			(match) => match.entity.type === entity.type && match.entity.id === entity.id,
		)
	}

	async add(entity: Interaction, factory: ReviewFactory) {
		const data = await factory.toModel()
		return await this.repository.add({ ...data, entity })
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async listenToOne(id: string, listener: Listeners<ReviewEntity>) {
		return await this.repository.listenToOne(id, listener)
	}
}
