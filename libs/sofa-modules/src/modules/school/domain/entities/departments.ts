import { BaseEntity } from '@modules/core'
import { DepartmentFromModel } from '../../data/models/departments'

export class DepartmentEntity extends BaseEntity {
	public readonly id: string
	public readonly title: string
	public readonly institutionId: string
	public readonly facultyId: string
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({ id, title, institutionId, facultyId, createdAt, updatedAt }: DepartmentFromModel) {
		super()
		this.id = id
		this.title = title
		this.institutionId = institutionId
		this.facultyId = facultyId
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}
