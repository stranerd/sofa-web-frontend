import { BaseEntity } from '@modules/core'
import { FacultyFromModel } from '../../data/models/faculties'

export class FacultyEntity extends BaseEntity {
	public readonly id: string
	public readonly name: string
	public readonly institutionId: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, name, institutionId, createdAt, updatedAt }: FacultyFromModel) {
		super()
		this.id = id
		this.name = name
		this.institutionId = institutionId
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
