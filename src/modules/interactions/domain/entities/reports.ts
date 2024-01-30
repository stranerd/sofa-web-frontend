import { ReportFromModel } from '../../data/models/reports'
import { InteractionEntity } from '../types'
import { EmbeddedUser } from '@modules/users'
import { BaseEntity } from '@modules/core'

export class ReportEntity extends BaseEntity {
	public readonly id: string
	public readonly entity: InteractionEntity
	public readonly user: EmbeddedUser
	public readonly message: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, entity, user, message, createdAt, updatedAt }: ReportFromModel) {
		super()
		this.id = id
		this.entity = entity
		this.user = user
		this.message = message
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
