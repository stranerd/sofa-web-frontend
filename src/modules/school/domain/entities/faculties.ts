import { FacultyFromModel } from '../../data/models/faculties'
import { BaseEntity } from '@modules/core'

export class FacultyEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly institutionId: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({ id, title, institutionId, createdAt, updatedAt }: FacultyFromModel) {
		super()
		this.id = id
		this.title = title
		this.institutionId = institutionId
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
