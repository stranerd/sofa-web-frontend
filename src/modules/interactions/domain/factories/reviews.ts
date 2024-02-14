import { v } from 'valleyed'
import { ReviewToModel } from '../../data/models/reviews'
import { ReviewEntity } from '../entities/reviews'
import { BaseFactory } from '@modules/core'

export class ReviewFactory extends BaseFactory<ReviewEntity, Omit<ReviewToModel, 'entity'>, Omit<ReviewToModel, 'entity'>> {
	readonly rules = {
		message: v.string().min(1),
		rating: v.number().lte(5).gte(1),
	}

	reserved = []

	constructor() {
		super({ message: '', rating: 1 })
	}

	loadEntity = (entity: ReviewEntity) => {
		this.message = entity.message
	}

	model = async () => {
		const { message, rating } = this.validValues
		return { message, rating }
	}
}
