import { ReviewEntity } from '../entities/reviews'
import { ReviewFactory } from '../factories/reviews'
import { IReviewRepository } from '../irepositories/reviews'
import { Interaction } from '../types'
import { Listeners } from '@modules/core'

export class ReviewsUseCase {
	private repository: IReviewRepository

	constructor(repository: () => IReviewRepository) {
		this.repository = repository()
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
