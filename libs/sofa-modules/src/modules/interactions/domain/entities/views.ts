import { BaseEntity } from '@modules/core'
import { EmbeddedUser } from '@modules/users'
import { ViewFromModel } from '../../data/models/views'
import { InteractionEntity } from '../types'

export class ViewEntity extends BaseEntity {
	public readonly id: string
	public readonly entity: InteractionEntity
	public readonly user: EmbeddedUser
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, entity, user, createdAt, updatedAt }: ViewFromModel) {
		super()
		this.id = id
		this.entity = entity
		this.user = user
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
