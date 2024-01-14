import { EmbeddedUser } from '@modules/users'
import { ReviewFromModel } from '../../data/models/reviews'
import { InteractionEntity } from '../types'
import { BaseEntity } from '@modules/core'

export class ReviewEntity extends BaseEntity {
	public readonly id: string
	public readonly entity: InteractionEntity
	public readonly user: EmbeddedUser
	public readonly rating: number
	public readonly message: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, entity, user, rating, message, createdAt, updatedAt }: ReviewFromModel) {
		super()
		this.id = id
		this.entity = entity
		this.user = user
		this.rating = rating
		this.message = message
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
