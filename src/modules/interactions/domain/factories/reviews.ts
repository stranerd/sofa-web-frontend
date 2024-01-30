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

	get message() {
		return this.values.message
	}

	set message(value: string) {
		this.set('message', value)
	}

	get rating() {
		return this.values.rating
	}

	set rating(value: number) {
		this.set('rating', value)
	}

	loadEntity = (entity: ReviewEntity) => {
		this.message = entity.message
	}

	model = async () => {
		const { message, rating } = this.validValues
		return { message, rating }
	}
}
