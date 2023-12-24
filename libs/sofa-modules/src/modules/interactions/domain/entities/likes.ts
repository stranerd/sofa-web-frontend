import { BaseEntity } from '@modules/core'
import { EmbeddedUser } from '@modules/users'
import { LikeFromModel } from '../../data/models/likes'
import { InteractionEntity } from '../types'

export class LikeEntity extends BaseEntity {
	public readonly id: string
	public readonly value: boolean
	public readonly entity: InteractionEntity
	public readonly user: EmbeddedUser
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, value, entity, user, createdAt, updatedAt }: LikeFromModel) {
		super()
		this.id = id
		this.value = value
		this.entity = entity
		this.user = user
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
