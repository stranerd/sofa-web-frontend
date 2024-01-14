import { BaseEntity } from '@modules/core'
import { InstitutionFromModel } from '../../data/models/institutions'

export class InstitutionEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly isGateway: boolean
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, title, isGateway, createdAt, updatedAt }: InstitutionFromModel) {
		super()
		this.id = id
		this.title = title
		this.isGateway = isGateway
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
